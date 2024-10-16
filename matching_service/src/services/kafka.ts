import {
  Kafka,
  Producer,
  Consumer,
  EachMessagePayload,
  KafkaMessage,
  RecordMetadata,
} from "kafkajs";

export interface KafkaRequest {
  timestamp: number;
}

export type KafkaOnSuccess = () => void;
export type KafkaOnRecordSuccess = (records: RecordMetadata[]) => void;
export type KafkaOnError = (error: Error | undefined) => void;

export class KafkaFactory {
  kafka: Kafka;
  topics: string[];

  constructor(clientId: string, brokers: string[], topics: string[]) {
    this.kafka = new Kafka({
      clientId: clientId,
      brokers: brokers,
    });
    this.topics = topics;
  }

  async createTopicIfNotPresent(next: KafkaOnSuccess): Promise<void> {
    console.log("Creating topics if not present");
    const admin = this.kafka.admin();
    await admin.connect().then(() => {
      admin.listTopics().then((presentTopics) => {
        admin
          .createTopics({
            topics: this.topics.flatMap((topic) => {
              if (presentTopics.includes(topic)) return [];
              return { topic: topic, numPartitions: 1 };
            }),
          })
          .finally(() => {
            console.log("Topics created");
            next();
          });
      });
    });
  }
}

export class ProducerFactory {
  private producer: Producer;
  private topic: string;

  constructor(kafkaFactory: KafkaFactory, topic: string) {
    if (!kafkaFactory.topics.includes(topic)) {
      throw new Error(`Topic ${topic} not found in KafkaFactory`);
    }

    this.topic = topic;
    this.producer = kafkaFactory.kafka.producer();
  }

  public async start(): Promise<void> {
    try {
      await this.producer.connect();
      console.log("Producer connected");
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
}

export type KafkaMessageProcessor = (
  messagePayload: EachMessagePayload
) => Promise<void>;

export class ConsumerFactory {
  private consumer: Consumer;
  private topic: string;

  public constructor(
    kafkaFactory: KafkaFactory,
    groupId: string,
    topic: string
  ) {
    if (!kafkaFactory.topics.includes(topic)) {
      throw new Error(`Topic ${topic} not found in KafkaFactory`);
    }

    this.consumer = kafkaFactory.kafka.consumer({ groupId: groupId });
    this.topic = topic;
  }

  public async start() {
    await this.consumer.connect().then(() => console.log("Consumer connected"));
    await this.consumer
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
