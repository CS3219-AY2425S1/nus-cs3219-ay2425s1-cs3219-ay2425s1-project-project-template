import amqp, { Channel, Connection, ConsumeMessage } from "amqplib"
import cors from "cors"
import dotenv from "dotenv"
import express, { Express, Request, Response } from "express"

import { DIFFICULTY_QUEUE_MAPPING, DIFFICULTY_ROUTING_KEYS, DIFFICULTY_ROUTING_MAPPING, EXCHANGE } from "./constants"
import { connectToMongoDB, db } from "./db"
import { deepEqual, getRandomIntegerInclusive, sleep } from "./helper"
import { addUser, findUsersByCriteria, getUsersCollection, updateUserStatus } from "./models/user"
import { UserData } from "./types"

const app: Express = express()

dotenv.config()

app.use(express.json())
app.use(cors())

let users: UserData[] = []

let connection: Connection, channel: Channel

const connectRabbitMQ = async () => {
  try {
    const amqpServer = process.env.AMQP_SERVER
    console.log(amqpServer)
    connection = await amqp.connect(amqpServer)
    channel = await connection.createChannel()
    await channel.assertExchange(EXCHANGE, "topic", { durable: true })
    console.log("Connected to RabbitMQ")
  } catch (err) {
    console.error(err)
  }
}

connectRabbitMQ()
connectToMongoDB()

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

// async function pullDataFromExchange(queue) {
//   // Pull data from RabbitMQ
//   channel.consume(queue, async (msg) => {
//     const userData = JSON.parse(msg.content.toString());
//     await findMatch(userData); // Try to find a match
//   });
// }

async function pullDataFromExchange(queue: string) {
  console.log(">> QUEUE TO LISTEN: ", queue)
  try {
    await channel.assertQueue(queue, {
      durable: true
    })

    channel.consume(queue, async (message) => {
      if (message) {
        const user = JSON.parse(message.content.toString())
        const collection = await getUsersCollection()
        const existingUser = collection.findOne({ user_id: user.user_id })

        if (!existingUser) {
          await collection.insertOne(user)
        }

        channel.ack(message)
      }
    })
  } catch (error) {
    console.error("Error in pullDataFromExchange:", error)
  }
}

let waitingUsers: { [key: string]: (data: any) => void } = {}

async function matchUsers(userData: any, key: string): Promise<{ matchedUsers: any[] }> {
  let changeStream: any = null
  try {
    // Check for a matching user in the queue based on difficulty and topic
    const matchQuery = {
      difficulty: userData.difficulty,
      topic: userData.topic,
      user_id: { $ne: userData.user_id } // Exclude the current user
    }

    // Match on both difficulty and topic first
    let matchedUser = await db.collection("usersQueue").findOne(matchQuery)

    if (!matchedUser) {
      console.log("Step 1.1: No exact match found, checking for difficulty only")
      const difficultyOnlyQuery = {
        difficulty: userData.difficulty,
        user_id: { $ne: userData.user_id } // Exclude the current user
      }
      matchedUser = await db.collection("usersQueue").findOne(difficultyOnlyQuery)
    }

    if (!matchedUser) {
      console.log("Step 1: No exact match found, checking for topic only")
      const topicOnlyQuery = {
        topic: userData.topic,
        user_id: { $ne: userData.user_id } // Exclude the current user
      }
      matchedUser = await db.collection("usersQueue").findOne(topicOnlyQuery)
    }

    if (matchedUser) {
      console.log("Step 2: Match found, notifying both users")
      await db.collection("usersQueue").deleteOne({ user_id: matchedUser.user_id })
      await db.collection("usersQueue").deleteOne({ user_id: userData.user_id })

      const matchedResponse = {
        matchedUsers: [userData, matchedUser]
      }

      if (waitingUsers[userData.user_id]) {
        waitingUsers[userData.user_id](matchedResponse)
        delete waitingUsers[userData.user_id]
      }
      if (waitingUsers[matchedUser.user_id]) {
        waitingUsers[matchedUser.user_id](matchedResponse)
        delete waitingUsers[matchedUser.user_id]
      }

      return matchedResponse
    }

    const existingUser = await db.collection("usersQueue").findOne({ user_id: userData.user_id })
    if (!existingUser) {
      console.log("Step 3: No existing entry, adding user to queue")
      await db.collection("usersQueue").insertOne(userData)
    } else {
      console.log("Step 3: User already exists in the queue, skipping insert")
      return { matchedUsers: [] }
    }

    // **Create Change Stream and Handle Event**
    return new Promise((resolve) => {
      waitingUsers[userData.user_id] = resolve

      const timer = setInterval(async () => {
        console.log("Step 4: Timeout reached, removing user from queue")
        await db.collection("usersQueue").deleteOne({ user_id: userData.user_id })
        resolve({ matchedUsers: [] })
        delete waitingUsers[userData.user_id]

        // Close change stream on timeout
        if (changeStream) {
          try {
            console.log("Closing change stream on timeout")
            changeStream.close()
          } catch (e) {
            console.error(e)
            return { matchedUsers: [] }
          }
        }
      }, 30000)

      // **Create the change stream and manage lifecycle**
      changeStream = db.collection("usersQueue").watch()
      changeStream.on("change", async (change) => {
        console.log("Step 5: Change detected", change.operationType)

        if (change.operationType === "insert") {
          const newUser = change.fullDocument

          if (
            newUser.difficulty === userData.difficulty &&
            newUser.topic === userData.topic &&
            newUser.user_id !== userData.user_id // Avoid matching with oneself
          ) {
            console.log("Step 5.1: Match found through change stream")
            clearInterval(timer)
            await db.collection("usersQueue").deleteOne({ user_id: newUser.user_id })
            await db.collection("usersQueue").deleteOne({ user_id: userData.user_id })

            const matchedResponse = {
              matchedUsers: [userData, newUser]
            }

            if (waitingUsers[userData.user_id]) {
              waitingUsers[userData.user_id](matchedResponse)
              delete waitingUsers[userData.user_id]
            }
            if (waitingUsers[newUser.user_id]) {
              waitingUsers[newUser.user_id](matchedResponse)
              delete waitingUsers[newUser.user_id]
            }

            // **Close the change stream once a match is found**
            if (changeStream) {
              console.log("Closing change stream after match")
              changeStream.close()
            }
          }
        } else {
          clearInterval(timer)
          // **Close the change stream once a match is found**
          if (changeStream) {
            console.log("Closing change stream after delete event")
            changeStream.close()
          }
        }
      })
    })
  } catch (error) {
    console.error("Error in matchUsers:", error)

    // **Ensure the change stream is closed on error**
    if (changeStream) {
      console.log("Closing change stream on error")
      changeStream.close()
    }

    return { matchedUsers: [] }
  }
}

app.post("/match", async (req: Request, res: Response) => {
  const { userData, key } = req.body

  try {
    addDataToExchange(userData, key)
    console.log("Data Sent: ", req.body)

    const MAX_WAIT_TIME = 30000
    let matchFound = false
    let response = { matchedUsers: [] }

    const waitForMatch = async () => {
      const startTime = Date.now()
      while (Date.now() - startTime < MAX_WAIT_TIME && !matchFound) {
        response = (await matchUsers(userData, key)) as { matchedUsers: UserData[] }
        if (response.matchedUsers.length === 2) {
          matchFound = true
          break
        }
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    await waitForMatch()

    if (response.matchedUsers.length === 2) {
      const matchedUserIds = response.matchedUsers.map((user) => user.user_id)
      await db.collection("usersQueue").deleteMany({ user_id: { $in: matchedUserIds } })

      delete waitingUsers[response.matchedUsers[0].user_id]
      delete waitingUsers[response.matchedUsers[1].user_id]

      res.json({
        matchedUsers: response.matchedUsers,
        timeout: false
      })
    } else {
      await db.collection("usersQueue").deleteOne({ user_id: userData.user_id })
      res.json({
        matchedUsers: [],
        timeout: true
      })
    }
  } catch (error) {
    console.error("Error while matching:", error)
    res.status(500).json({
      matchedUsers: [],
      timeout: true
    })
  }
})

app.post("/match/delete", (req: Request, res: Response) => {
  users = users.filter((user) => {
    return user.user_id != req.body.user_id
  })

  res.json({
    message: "User removed from the queue"
  })
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
