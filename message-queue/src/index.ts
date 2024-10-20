import amqp, { Channel, Connection, ConsumeMessage } from "amqplib"
import dotenv from "dotenv"
import express, { Express, Request, Response } from "express"

import {
  DIFFICULTY_ROUTING_KEYS,
  DIFFICULTY_ROUTING_MAPPING,
  EASY_ROUTING_KEY,
  EXCHANGE,
  HARD_ROUTING_KEY,
  MEDIUM_ROUTING_KEY
} from "./constants"
import { deepEqual, getRandomIntegerInclusive, sleep } from "./helper"
import { UserData } from "./types"

const app: Express = express()

dotenv.config()

app.use(express.json())

let users: UserData[] = []

let connection: Connection, channel: Channel

const connectRabbitMQ = async () => {
  try {
    const amqpServer = process.env.AMQP_SERVER
    console.log(amqpServer)
    connection = await amqp.connect(amqpServer)
    channel = await connection.createChannel()
    await channel.assertExchange(EXCHANGE, "topic", { durable: false })
    console.log("Connected to RabbitMQ")
  } catch (err) {
    console.error(err)
  }
}

connectRabbitMQ()

const handleIncomingNotification = (msg: string) => {
  try {
    const parsedMessage = JSON.parse(msg)

    // console.log(`Received Notification`, parsedMessage)
    users.push(parsedMessage)
    console.log(">>USERS: ", users)
    return parsedMessage
  } catch (error) {
    console.error(`Error while parsing the message`)
  }
}

// Decide again if needs to be asynchronous
const addDataToExchange = (userData: UserData, key: string) => {
  channel.publish(EXCHANGE, key, Buffer.from(JSON.stringify(userData)))
}

const pullDataFromExchange = async (queueName: string) => {
  let message: amqp.ConsumeMessage
  await channel.assertQueue(queueName, {
    durable: true
  })

  await channel.consume(queueName, (msg) => {
    if (!msg) {
      return console.error("Invalid incoming message")
    }
    message = msg
    try {
      handleIncomingNotification(msg?.content?.toString())
      channel.ack(msg)
    } catch (e) {
      console.log("Invalid message received")
      console.error(e)
      return {
        channel,
        message: ""
      }
    }
  })

  return {
    channel,
    message
  }
}

// Publish message to exchange
app.post("/match", (req: Request, res: Response) => {
  try {
    const { userData, key } = req.body //key-value pair of userData will be <difficulty>.<topic(s)>
    addDataToExchange(userData, key)
    console.log("Data Sent: ", req.body)
    res.json({ message: "Data Sent" })
  } catch (e) {
    console.error("Message incorrectly sent out")
    console.error(e)
    res.json({ message: "Data failed to send" })
  }
})

app.get("/match", async (req: Request, res: Response, next) => {
  const matchedUsers = []
  if (req.query.hasOwnProperty("queueName")) {
    // 1. Pull data from the respective queue, store into global users array
    await pullDataFromExchange(req.query.queueName as string)
    const firstUser = users.shift()
    console.log(">> FIRST USER: ", firstUser)
    if (!firstUser) {
      res.json({
        matchedUsers,
        timeout: true
      })
      return;
    }
    matchedUsers.push(firstUser)

    // Case 3: Only 1 person in the queue
    let timeWaitedForMessage = 0
    let currentTotalUsersWaiting = users.length

    console.log(">>USER LENGTH: ", users.length)

    if (users.length == 0) {
      const waitForNewMessagesInterval = setInterval(async () => {
        await pullDataFromExchange(req.query.queueName as string)
        timeWaitedForMessage += 2
        console.log("Time waited for message Case 3: ", timeWaitedForMessage)
        if (timeWaitedForMessage == 20 || users.length != currentTotalUsersWaiting) {
          clearInterval(waitForNewMessagesInterval)
        }
      }, 2000)

      while (timeWaitedForMessage < 20 && users.length == currentTotalUsersWaiting) {
        await sleep(1000)
      }

      // Means if new users have been added to the overall queue
      if (currentTotalUsersWaiting != users.length) {
        for (const user of users) {
          if (user.topic == firstUser.topic && user.user_id != firstUser.user_id) {
            matchedUsers.push(user)
            break
          }
        }

        // Possible that there isn't a perfect match
        // In that case jump to next if statement
        if (matchedUsers.length == 2) {
          res.json({
            matchedUsers,
            timeout: false
          })
          return
        }
      }

      if (users.length > 0) {
        console.log("Reach the default route")
        // Filter one more level (Obtain users that are of the requested difficulty, try)
        // To try and match on difficulty at least (tie-break)
        const filteredUsersForDesiredDifficulty = users.filter((user: UserData) => {
          return DIFFICULTY_ROUTING_MAPPING[req.query.queueName as string] == user.difficulty
        })

        let nextUser: UserData
        if (filteredUsersForDesiredDifficulty.length > 0) {
          const randomlySelectedIndex = getRandomIntegerInclusive(0, filteredUsersForDesiredDifficulty.length - 1)
          nextUser = filteredUsersForDesiredDifficulty[randomlySelectedIndex]
          const userIdxOriginalArr = users.findIndex((user) => deepEqual(nextUser, user))
          users.splice(userIdxOriginalArr, 1)
        } else {
          const randomlySelectedIndex = getRandomIntegerInclusive(0, users.length - 1)
          nextUser = users.splice(randomlySelectedIndex, 1)[0]
        }

        if (nextUser.user_id == firstUser.user_id) {
          res.json({
            matchedUsers: [], // don't allow 2 same user to match
            timeout: true
          })
          return;
        }
        matchedUsers.push(nextUser)
        res.json({
          matchedUsers,
          timeout: false
        })
        return
      } else {
        console.log("Reach the filtered route")
        // Try to pull data from other difficulty queues
        const filteredQueueNames = DIFFICULTY_ROUTING_KEYS.filter((routeKey) => {
          return routeKey != req.query.queueName
        })

        for (const queueName of filteredQueueNames) {
          await pullDataFromExchange(queueName as string)
        }

        for (const user of users) {
          if (user.topic == firstUser.topic && user.user_id != firstUser.user_id) {
            matchedUsers.push(user)
            break
          }

          if (matchedUsers.length == 2) {
            res.json({
              matchedUsers,
              timeout: false
            })
            return
          }
        }

        // Timeout, cannot find match; assumes matchedUsers.length != 2
        res.json({
          matchedUsers: [],
          timeout: true
        })
      }
    }

    for (const user of users) {
      console.log("Reached Case 1")
      // Case (1) - 2 people in queue have matching topic
      if (user.topic == firstUser.topic && user.user_id != firstUser.user_id) {
        matchedUsers.push(user)
        break
      }
    }

    if (matchedUsers.length == 2) {
      res.json({
        matchedUsers,
        timeout: false
      })
      return
    }

    // Case (2) -> 1 person in queue, non matched topic so far
    timeWaitedForMessage = 0
    currentTotalUsersWaiting = users.length
    const waitForNewMessagesInterval = setInterval(async () => {
      await pullDataFromExchange(req.query.queueName as string)
      timeWaitedForMessage += 2
      console.log("Time waited for message Case 2: ", timeWaitedForMessage)
      if (timeWaitedForMessage == 20 || users.length != currentTotalUsersWaiting) {
        clearInterval(waitForNewMessagesInterval)
      }
    }, 2000)

    while (timeWaitedForMessage < 20 && users.length == currentTotalUsersWaiting) {
      await sleep(1000)
    }

    // Check currentTotalUsersWaiting with current user's length
    // If different, means new user added
    if (currentTotalUsersWaiting != users.length) {
      for (const user of users) {
        if (user.topic == firstUser.topic && user.user_id != firstUser.user_id) {
          matchedUsers.push(user)
          break
        }
      }

      // Possible that there isn't a perfect match
      // In that case jump to next if statement
      if (matchedUsers.length == 2) {
        res.json({
          matchedUsers,
          timeout: false
        })
        return
      }
    }

    if (users.length > 0) {
      // If still stuck with the same number of people
      // Randomly match amongst current users
      console.log("Randomly matched amongst current users case 3")

      // Filter one more level (Obtain users that are of the requested difficulty, try)
      // To try and match on difficulty at least (tie-break)
      const filteredUsersForDesiredDifficulty = users.filter((user: UserData) => {
        return DIFFICULTY_ROUTING_MAPPING[req.query.queueName as string] == user.difficulty
      })

      let nextUser: UserData
      if (filteredUsersForDesiredDifficulty.length > 0) {
        const randomlySelectedIndex = getRandomIntegerInclusive(0, filteredUsersForDesiredDifficulty.length - 1)
        nextUser = filteredUsersForDesiredDifficulty[randomlySelectedIndex]
        const userIdxOriginalArr = users.findIndex((user) => deepEqual(nextUser, user))
        users.splice(userIdxOriginalArr, 1)
      } else {
        const randomlySelectedIndex = getRandomIntegerInclusive(0, users.length - 1)
        nextUser = users.splice(randomlySelectedIndex, 1)[0]
      }

      if (nextUser.user_id == firstUser.user_id) {
        res.json({
          matchedUsers: [], // don't allow 2 same user to match
          timeout: false
        })
        return;
      }

      matchedUsers.push(nextUser)
      res.json({
        matchedUsers,
        timeout: false
      })
      return
    } else {
      // Try to pull data from other difficulty queues
      const filteredQueueNames = DIFFICULTY_ROUTING_KEYS.filter((routeKey) => {
        return routeKey != req.query.queueName
      })

      for (const queueName of filteredQueueNames) {
        await pullDataFromExchange(queueName as string)
      }

      for (const user of users) {
        if (user.topic == firstUser.topic && user.user_id != firstUser.user_id) {
          matchedUsers.push(user)
          break
        }

        if (matchedUsers.length == 2) {
          res.json({
            matchedUsers,
            timeout: false
          })
          return
        }
      }

      // Timeout, cannot find match; assumes matchedUsers.length != 2
      res.json({
        matchedUsers: [],
        timeout: true
      })
    }
  }
})

app.use((req: Request, res: Response, next) => {
  const error: Error = new Error("Route Not Found")
  next(error)
})

app.use((error, req: Request, res: Response, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message
    }
  })
})

app.listen(3002, () => {
  console.log("Publisher running.")
})
