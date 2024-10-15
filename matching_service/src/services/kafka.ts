import {
  Kafka,
  Producer,
  Consumer,
  EachMessagePayload,
  KafkaMessage,
} from "kafkajs";

export interface KafkaRequest {
  timestamp: number;
}

export class ProducerFactory {
  private producer: Producer;
  private topic: string;

  constructor(kafka: Kafka, topic: string) {
    this.topic = topic;
    this.createTopicIfNotPresent(kafka, () => {});

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

  public async sendMessage(message: KafkaRequest): Promise<void> {
    await this.producer.send({
      topic: this.topic,
      messages: [{ value: JSON.stringify(message), partition: 0 }],
    });
  }

  private createTopicIfNotPresent(kafka: Kafka, next: () => void): void {
    const admin = kafka.admin();
    admin
      .connect()
      .then(() => {
        admin.listTopics().then((topics) => {
          if (!topics.includes(this.topic)) {
            kafka.admin().createTopics({
              topics: [{ topic: this.topic }],
            });
          }
        });
      })
      .finally(next);
  }
}

export type KafkaMessageProcessor = (
  messagePayload: EachMessagePayload
) => Promise<void>;

export class ConsumerFactory {
  private consumer: Consumer;
  private topic: string;

  public constructor(groupId: string, kafka: Kafka, topic: string) {
    this.consumer = kafka.consumer({ groupId: groupId });
    this.topic = topic;
  }

  public async getMessages(): Promise<Array<KafkaMessage>> {
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: this.topic,
      fromBeginning: true,
    });

    try {
      const res: Array<KafkaMessage> = [];

      await this.consumer.run({
        autoCommit: false,
        eachMessage: async (messagePayload) => {
          res.push(messagePayload.message);
          console.log(messagePayload);
        },
      });

      return res;
    } catch (error) {
      console.log(error);
      return [];
    }
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
