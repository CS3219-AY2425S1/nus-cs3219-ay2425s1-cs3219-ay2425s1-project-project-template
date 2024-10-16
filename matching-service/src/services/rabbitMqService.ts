import amqp, { Channel } from "amqplib";

let channel: Channel;
const rabbit_url = process.env.RABBITMQ_URL || "amqp://localhost";

/**
 * Establish a connection to RabbitMQ
 */
export const initRabbitMQ = async (): Promise<void> => {
  try {
    const connection = await amqp.connect(rabbit_url);
    channel = await connection.createChannel();
    console.log("Connected to RabbitMQ");
  } catch (err) {
    console.error("RabbitMQ connection error:", err);
  }
};

/**
 * Get the RabbitMQ channel
 * @returns RabbitMQ channel
 */
export const getChannel = (): amqp.Channel => {
  if (!channel) {
    throw new Error("RabbitMQ channel is not initialized");
  }
  return channel;
};

/**
 * Subscribes to a RabbitMQ queue and calls the callback function when a message is received.
 * @param queue queue to subscribe to
 * @param callback callback when message is received
 */
export const subscribeToQueue = async <T>(
  queue: string,
  callback: (message: T) => void,
): Promise<void> => {
  try {
    if (!channel) throw new Error("RabbitMQ channel is not initialized");

    await channel.assertQueue(queue);
    console.log(`Subscribed to RabbitMQ queue "${queue}"`);

    channel.consume(queue, (msg) => {
      if (msg !== null) {
        const message: T = JSON.parse(msg.content.toString());
        console.log(
          `Received message from RabbitMQ queue "${queue}":`,
          message,
        );
        callback(message);
        channel.ack(msg);
      }
    });
  } catch (err) {
    console.error(`Error subscribing to RabbitMQ queue "${queue}":`, err);
  }
};

/**
 * Sends a payload to a RabbitMQ queue
 * @param queue queue to send payload to
 * @param payload payload object to send
 */
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
