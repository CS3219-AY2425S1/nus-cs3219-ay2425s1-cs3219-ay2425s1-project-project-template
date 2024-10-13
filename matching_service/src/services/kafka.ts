import {
  Kafka,
  Message,
  Producer,
  Consumer,
  ProducerBatch,
  TopicMessages,
  EachMessagePayload,
} from "kafkajs";

export interface KafkaRequest {}

export class ProducerFactory {
  private producer: Producer;
  private topic: string;

  constructor(kafka: Kafka, topic: string) {
    this.producer = kafka.producer();
    this.topic = topic;
  }

  public async start(): Promise<void> {
    try {
      await this.producer.connect();
    } catch (error) {
      console.log("Error connecting the producer: ", error);
    }
  }

  public async shutdown(): Promise<void> {
    await this.producer.disconnect();
  }

  public async sendBatch(messages: Array<KafkaRequest>): Promise<void> {
    const kafkaMessages: Array<Message> = messages.map((message) => {
      return {
        value: JSON.stringify(message),
      };
    });

    const topicMessages: TopicMessages = {
      topic: this.topic,
      messages: kafkaMessages,
    };

    const batch: ProducerBatch = {
      topicMessages: [topicMessages],
    };

    await this.producer.sendBatch(batch);
  }
}

export type KafkaMessageProcessor = (
  messagePayload: EachMessagePayload
) => Promise<void>;

export class ConsumerFactory {
  private consumer: Consumer;
  private messageProcessor: KafkaMessageProcessor;
  private topic: string;

  public constructor(
    messageProcessor: KafkaMessageProcessor,
    groupId: string,
    kafka: Kafka,
    topic: string
  ) {
    this.messageProcessor = messageProcessor;
    this.consumer = kafka.consumer({ groupId: groupId });
    this.topic = topic;
  }

  public async start(): Promise<void> {
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: this.topic,
      fromBeginning: true,
    });
    await this.consumer.run({
      autoCommit: false,
      eachMessage: async (messagePayload) =>
        this.messageProcessor(messagePayload),
    });
    this.consumer;
  }

  public async commit(offset: string): Promise<void> {
    await this.consumer.commitOffsets([
      { topic: this.topic, partition: 0, offset: offset },
    ]);
  }

  public async shutdown(): Promise<void> {
    await this.consumer.disconnect();
  }
}

export default async function processMessage(
  messagePayload: EachMessagePayload
): Promise<void> {
  const { topic, partition, message } = messagePayload;

  // Extract the message value (stored as a Buffer) and convert it to a string
  const messageValue = message.value ? message.value.toString() : null;

  // Process the message here (e.g., log it, perform business logic, etc.)
  console.log(`Received message from topic ${topic}, partition ${partition}`);
  console.log(`Message: ${messageValue}`);

  // Additional logic (parsing JSON, handling errors, etc.) can be added here
  try {
    if (messageValue) {
      const parsedData = JSON.parse(messageValue); // Example: parsing JSON
      // Process parsedData (your business logic goes here)
    }
  } catch (error) {
    console.error(`Error processing message: ${error}`);
  }

  // Optionally: Perform a heartbeat to let Kafka know this consumer is alive
  await messagePayload.heartbeat();
}
