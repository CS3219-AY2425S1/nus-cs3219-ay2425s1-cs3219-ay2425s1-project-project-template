import amqp, { Channel } from "amqplib";
import { storeUser } from "../model/userModel";
import { User } from "../types";
import { processNewUser } from "./matchingService";

let channel: Channel;
const rabbit_url = process.env.RABBITMQ_URL || "amqp://localhost";

export const initRabbitMQ = async (queue: string): Promise<void> => {
  try {
    const connection = await amqp.connect(rabbit_url);
    channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });
    console.log(`RabbitMQ initialised and subscribed to ${queue}`);

    // Start consuming messages from matching-service
    channel.consume(queue, async (msg) => {
      if (msg !== null) {
        const user: User = JSON.parse(msg.content.toString());
        console.log("Received message from queue:", user);

        // Store the user into Redis
        try {
          await processNewUser(user);
        } catch (err) {
          console.error("Error storing user in Redis:", err);
        }

        channel.ack(msg);
      }
    });
  } catch (err) {
    console.error("RabbitMQ connection error:", err);
  }
};

export const getChannel = (): amqp.Channel => {
  if (!channel) {
    throw new Error("RabbitMQ channel is not initialized");
  }
  return channel;
};

// Send a payload to a specified RabbitMQ queue
export const sendToQueue = async (
  queue: string,
  payload: Object,
): Promise<void> => {
  try {
    if (!channel) throw new Error("RabbitMQ channel is not initialized");

    await channel.assertQueue(queue);

    await channel.sendToQueue(queue, Buffer.from(JSON.stringify(payload)));
    console.log(`User sent to RabbitMQ queue "${queue}":`, payload);
  } catch (err) {
    console.error(`Error sending to RabbitMQ queue "${queue}":`, err);
  }
};
