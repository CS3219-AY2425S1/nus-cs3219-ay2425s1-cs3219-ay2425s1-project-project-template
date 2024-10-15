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
    this.consumer.connect().then(() => console.log("Consumer connected"));
    this.consumer
      .subscribe({
        topic: this.topic,
        fromBeginning: true,
      })
      .then(() => console.log(`Subscribed to topic ${this.topic}`));
  }

  public async getMessages(): Promise<KafkaMessage[]> {
    try {
      let messageBuffer: Array<KafkaMessage> = [];

      await this.consumer.run({
        autoCommit: false,
        eachMessage: async (messagePayload) => {
          messageBuffer.push(messagePayload.message);
          console.log(messagePayload.message);
        },
      });

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(messageBuffer);
        }, 1000);
      });
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
