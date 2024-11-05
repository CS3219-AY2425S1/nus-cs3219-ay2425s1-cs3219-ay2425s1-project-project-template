import amqp from "amqplib"
import { updateUsers } from "../model/repository.js";

const QUEUE = 'add_session_queue'
let channel;

export const connectToRabbitMQ = async () => {
    try {
        const amqpServer = "amqps://lguugvwb:UtQY1D0zOoX8s0ZvR4GunuRDk0xv8UuI@octopus.rmq3.cloudamqp.com/lguugvwb"
        const connection = await amqp.connect(amqpServer)
        channel = await connection.createChannel()
        console.log("Connected to RabbitMQ")
    } catch (err) {
      console.log(err)
    }
}

const startConsume = async (onMessage) => {
  try {
    await channel.assertQueue(QUEUE, {
      durable: true,
    })
    channel.consume(QUEUE, msg => {
      if (msg) {
        onMessage(JSON.parse(Buffer.from(msg.content)))
        channel.ack(msg)
      }
    })
  } catch (err) {
    console.log(err)
  }
}

async function onMessage(message) {
  updateUsers(message.users.username1, message.users.username2, message.question)
}

export const initConsumer = () => startConsume(onMessage)