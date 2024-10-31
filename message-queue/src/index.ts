import amqp, { Channel, Connection, ConsumeMessage } from "amqplib"
import cors from "cors"
import dotenv from "dotenv"
import express, { Express, Request, Response } from "express"

import { DIFFICULTY_QUEUE_MAPPING, DIFFICULTY_ROUTING_KEYS, DIFFICULTY_ROUTING_MAPPING, EXCHANGE } from "./constants"
import { deepEqual, getRandomIntegerInclusive, sleep } from "./helper"
import { addUser, findUsersByCriteria, updateUserStatus } from "./models/user"
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

async function pullDataFromExchange(queueName) {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URI || "amqp://localhost")
    const channel = await connection.createChannel()
    await channel.assertQueue(queueName, { durable: true })

    console.log(`Waiting for messages in ${queueName}...`)

    // Consume messages from the queue
    channel.consume(
      queueName,
      async (msg) => {
        if (msg !== null) {
          const userData = JSON.parse(msg.content.toString())

          console.log("Received message:", userData)

          // Add user to MongoDB's "users" collection
          await addUser(userData)

          // Check for matches using the updated matchUsers logic
          const matchedUser = await matchUsers(userData, queueName)

          if (matchedUser) {
            // Update queue status for both matched users in MongoDB
            await updateUserStatus([userData.user_id, matchedUser.user_id], "matched")

            // Acknowledge the message after successful processing and matching
            channel.ack(msg)

            console.log(`Matched users: ${userData.user_id} with ${matchedUser.user_id}`)
          } else {
            console.log(`No match found for user: ${userData.user_id}`)
          }
        }
      },
      { noAck: false }
    ) // Ensure noAck is set to false for manual acknowledgement
  } catch (error) {
    console.error("Error while pulling data from exchange:", error)
  }
}
async function matchUsers(userData, key) {
  // Priority: find by difficulty first, if no match, fall back to exact topic
  let match = await findUsersByCriteria({
    difficulty: userData.difficulty,
    topic: userData.topic,
    queue_status: { $ne: "matched" },
    user_id: { $ne: userData.user_id }
  })

  if (match.length === 0) {
    // If no users found with matching difficulty, match on topic
    match = await findUsersByCriteria({
      topic: userData.topic,
      queue_status: { $ne: "matched" },
      user_id: { $ne: userData.user_id }
    })
  }

  if (match.length === 0) {
    // If no match based on both, consider a random match
    match = await findUsersByCriteria({
      queue_status: { $ne: "matched" },
      user_id: { $ne: userData.user_id }
    })
  }

  return match.length ? match[0] : null
}

app.post("/match", async (req, res) => {
  try {
    const { userData, key } = req.body

    // Add the user to the MongoDB queue
    await addUser(userData)

    // Attempt to find a match for the user by difficulty first, then by topic
    const matchedUser = await matchUsers(userData, key)

    if (matchedUser) {
      // Update users' queue status to "matched" in MongoDB
      await updateUserStatus([userData.user_id, matchedUser.user_id], "matched")

      res.json({
        matchedUsers: [userData, matchedUser],
        timeout: false
      })
    } else {
      // No match found, send timeout response
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
