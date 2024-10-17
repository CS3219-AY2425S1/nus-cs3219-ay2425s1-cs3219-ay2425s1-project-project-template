import dotenv from "dotenv";
import { Kafka, KafkaMessage, RecordMetadata } from "kafkajs";
import {
  KafkaRequest,
  ProducerFactory,
  ConsumerFactory,
  KafkaFactory,
} from "./kafka";

dotenv.config();

export interface IMatchRequest extends KafkaRequest {
  username: string;
  topic: string;
  difficulty: string;
}

export interface IMatchCancelRequest {
  username: string;
}

export interface IMatchResponse {
  success: boolean;
}

export interface IMatchCancelResponse {
  success: boolean;
}

export interface IMatch {
  roomId: string;
  usernames: string[];
  topic: string;
  difficulty: string;
}

export interface IQueue {
  add(request: IMatchRequest): Promise<IMatchResponse>;
  cancel(request: IMatchCancelRequest): Promise<IMatchCancelResponse>;
  getRequests(): Map<string, IMatchRequest[]>;
  processMessage(message: KafkaMessage): void;
}

interface KafkaMessageLocation {
  offset: string;
  partition: number;
}

export class Queue implements IQueue {
  private producer: ProducerFactory;
  private consumer: ConsumerFactory;
  private offsetMap: Map<string, KafkaMessageLocation>;
  private topicMap: Map<string, IMatchRequest[]>;
  private isConsumerRunning = false;

  constructor() {
    // Setup connection to Kafka if using Kafka
    const kafka = new KafkaFactory(
      "match-queue",
      [`${process.env.KAFKA_BROKER_ROUTE}:${process.env.KAFKA_BROKER_PORT}`],
      ["match-queue"]
    );

    // Setup producer and consumer
    this.producer = new ProducerFactory(kafka, "match-queue");
    this.consumer = new ConsumerFactory(kafka, "match-group", "match-queue");
    this.offsetMap = new Map();
    this.topicMap = new Map();
    kafka.createTopicIfNotPresent(() => {
      this.producer.start();
    });
  }

  public async add(request: IMatchRequest): Promise<IMatchResponse> {
    if (!this.isConsumerRunning) {
      this.consumer.start(this.processMessage.bind(this));
      this.isConsumerRunning = true;
    }

    // check if user already exists in queue
    if (this.checkIfUserExists(request.username)) {
      return {
        success: false,
      };
    }

    // add to queue, then return success message
    let success = false;
    this.producer.sendMessage(
      request,
      (record) => {
        success = true;
        this.onAddRequestSuccess(request, record);
      },
      (error) => {
        console.error("Error sending message: ", error);
      }
    );

    return {
      success: success,
    };
  }

  public async cancel(
    request: IMatchCancelRequest
  ): Promise<IMatchCancelResponse> {
    // remove from queue, then return success message
    console.log("Cancelling request for user: ", request.username);
    const msgLocation = this.offsetMap.get(request.username);
    var success = false;

    if (msgLocation != undefined) {
      const { offset, partition } = msgLocation;
      console.log("Committing offset: ", offset, "at partition: ", partition);
      success = true;
      this.consumer.commit(
        offset,
        partition,
        () => {
          this.onCommitSuccess(request.username);
          success = true;
        },
        (error) => {
          console.error("Error committing offset: ", error);
        }
      );
    }

    return {
      success: success,
    };
  }

  public getRequests(): Map<string, IMatchRequest[]> {
    // return all requests in the queue
    console.log("getRequest");
    console.log(this.topicMap.size);
    this.topicMap.forEach((value) => console.log(value));
    return this.topicMap;
  }

  private checkIfUserExists(username: string): boolean {
    return this.offsetMap.has(username);
  }

  private onAddRequestSuccess(request: IMatchRequest, record: RecordMetadata) {
    // Validate the record metadata
    if (record.baseOffset !== undefined) {
      this.offsetMap.set(request.username, {
        offset: record.baseOffset,
        partition: record.partition,
      });
      console.log("Successfully added request to queue");
    }
  }

  private onCommitSuccess(username: string) {
    this.offsetMap.delete(username);
    console.log("Successfully removed request from queue");
  }

  public processMessage(message: KafkaMessage) {
    const request: IMatchRequest = JSON.parse(message.value?.toString() ?? "");

    const topic = `${request.topic}-${request.difficulty}`;

    if (this.topicMap.get(topic)) {
      this.topicMap.set(topic, []);
    }

    this.topicMap.get(topic)?.push(request);
  }
}
