import amqp, { Channel, Connection, ConsumeMessage } from "amqplib"
import dotenv from "dotenv"
import express, { Express, Request, Response } from "express"

import { DIFFICULTY_QUEUE, EXCHANGE } from "./constants"
import { UserData } from "./types"

const app: Express = express()

dotenv.config()

app.use(express.json())
// app.use(express.urlencoded({ extended: true }))

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

  channel.prefetch(1)
  await channel.consume(queueName, (msg) => {
    if (!msg) {
      return console.error("Invalid incoming message")
    }
    message = msg;
    handleIncomingNotification(msg?.content?.toString())
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
  if (req.query.hasOwnProperty("queueName")) {
    const { channel, message } = await pullDataFromExchange(
      req.query.queueName as string
    )
    if (message) {
      // Do some logic, then ACK
      console.log("Now then we acknowledge, so we force 1 message to be received at each time")
      channel.ack(message);
    }
    res.json({
      message: JSON.parse(message.content.toString())
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
