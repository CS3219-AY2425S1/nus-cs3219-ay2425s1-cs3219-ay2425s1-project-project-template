import amqp, { Channel, Connection, ConsumeMessage } from "amqplib"
import dotenv from "dotenv"
import express, { Express, Request, Response } from "express"

import { EXCHANGE } from "./constants"
import { UserData } from "./types"
import { getRandomIntegerInclusive, sleep } from "./helper"

const app: Express = express()

dotenv.config()

app.use(express.json())

let users : UserData[] = []

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
    users.unshift(parsedMessage)
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
    matchedUsers.push(firstUser);

    // Case 3: Only 1 person in the queue
    let timeWaitedForMessage = 0
    let currentTotalUsersWaiting = users.length;

    // if (users.length == 0) {
    //   const waitForNewMessagesInterval = setInterval(async () => {
    //     if (timeWaitedForMessage == 8) {
    //       clearInterval(waitForNewMessagesInterval)
    //     }
    //     await pullDataFromExchange(req.query.queueName as string)
    //     timeWaitedForMessage += 2
    //   }, 2000)
      
    //   while (timeWaitedForMessage != 8) { 
    //     sleep(1000);
    //   }

    //   if (currentTotalUsersWaiting > users.length) {
    //     for (const user of users) {
          
    //     }
    //   } else {
    //     // Randomly match amongst current users
    //   }
    // }

    for (const user of users) {
      console.log("Reached this case")
      // Case (1) - 2 people in queue have matching topic
      if (user.topic == firstUser.topic && user.user_id != firstUser.user_id) {
        matchedUsers.push(user);
        break;
      }
    }

    console.log("Reached here: ", matchedUsers);
    
    if (matchedUsers.length == 2) {
      res.json({
        matchedUsers
      })
      users = [];
      return;
    }

    // Case (2) - >1 person in queue, non matched topic so far
    timeWaitedForMessage = 0
    currentTotalUsersWaiting = users.length;
    const waitForNewMessagesInterval = setInterval(async () => {
      await pullDataFromExchange(req.query.queueName as string)
      timeWaitedForMessage += 2
      console.log("Time waited for message: ", timeWaitedForMessage);
      if (timeWaitedForMessage == 8) {
        clearInterval(waitForNewMessagesInterval)
      }
    }, 2000)
    
    while (timeWaitedForMessage < 8) { 
      await sleep(1000);
      console.log("Im here now")
    }

    // Check currentTotalUsersWaiting with current user's length
    // If different, means new user added 
    if (currentTotalUsersWaiting > users.length) {
      for (const user of users) {
        if (user.topic == firstUser.topic && user.user_id != firstUser.user_id) {
          matchedUsers.push(user);
          break;
        }
      }

      if (matchedUsers.length == 2) {
        res.json({
          matchedUsers
        });
        return;
      }
    } else {
      // Randomly match amongst current users
      console.log("Randomly matched amongst current users")
      const randomlySelectedIndex = getRandomIntegerInclusive(0, users.length - 1);
      const nextUser = users.splice(randomlySelectedIndex, 1);
      matchedUsers.push(nextUser[0])
      res.json({
        matchedUsers
      });
      return;
    }


    // const { channel, message } = await pullDataFromExchange(
    //   req.query.queueName as string
    // )
    // Assuming only one message comes through
    // if (message) {
    //   // Consume all the messages coming through
    //   const parsedMessage = JSON.parse(message.content.toString())
    //   channel.ack(message);
    //   res.json({
    //     message: JSON.parse(message.content.toString())
    //   })
    // } else {
    // }
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
