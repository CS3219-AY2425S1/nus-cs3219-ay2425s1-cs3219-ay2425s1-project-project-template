import amqp, { Channel, Connection, ConsumeMessage } from "amqplib"
import dotenv from "dotenv"
import express, { Express, Request, Response } from "express"

import { DIFFICULTY_QUEUE } from "./constants"
import { UserData } from "./types"

const app: Express = express()

dotenv.config()

app.use(express.json())
// app.use(express.urlencoded({ extended: true }))

const EXCHANGE = "topics_exchange"

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

    console.log(`Received Notification`, parsedMessage)
  } catch (error) {
    console.error(`Error While Parsing the message`)
  }
}

// Decide again if needs to be asynchronous
const addDataToExchange = async (userData: UserData, key: string) => {
  await channel.publish(EXCHANGE, key, Buffer.from(JSON.stringify(userData)))
}

const pullDataFromExchange = async (queueName: string) => {
  await channel.assertQueue(queueName, {
    durable: true
  })

  await channel.consume(
    queueName,
    (msg) => {
      if (!msg) {
        return console.error("Invalid incoming message")
      }
      handleIncomingNotification(msg?.content?.toString())
      channel.ack(msg)
    },
    {
      noAck: false
    }
  )
}

// Publish message to exchange
app.post("/match", async (req: Request, res: Response) => {
  try {
    const { userData, key } = req.body //key-value pair of userData will be <difficulty>.<topic(s)>
    await addDataToExchange(userData, key)
    console.log("Data Sent: ", req.body)
    res.json({ message: "Data Sent" })
  } catch (e) {
    console.error("Message incorrectly sent out")
    console.error(e)
    res.json({ message: "Data failed to send" })
  }
})

app.get("/match", async (req: Request, res: Response, next) => {
  console.log("Hello World")
  // console.log(req);
  if (req.query.hasOwnProperty("queueName")) {
    await pullDataFromExchange(req.query.queueName as string)
    res.json({
      message: "This is message queue."
    })
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
 