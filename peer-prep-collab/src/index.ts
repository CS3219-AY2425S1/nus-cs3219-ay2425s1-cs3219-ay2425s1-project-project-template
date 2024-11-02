import amqp, { Channel, Connection, ConsumeMessage, Message } from "amqplib"

let channel: Channel

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

const startConsume = async (onMessage: (message: Message) => void) => {
  try {
    await channel.assertQueue('collab_queue', {
      durable: false,
      messageTtl: 30000,
    })
    channel.consume('collab_queue', msg => {
      if (msg) {
        onMessage(JSON.parse(msg.content.toString()))
        channel.ack(msg)
      }
    })
  } catch (err) {
    console.log(err)
  }
}

// To implement generation of session URL @LYNETTE @YUANTING -
function onMessage(message: any) {
  console.log("Session id: ", message.sessionId) 
}


export const initConsumer = () => startConsume(onMessage)