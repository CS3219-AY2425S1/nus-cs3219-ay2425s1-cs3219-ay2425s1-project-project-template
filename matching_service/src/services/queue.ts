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
  getRequests(): Promise<IMatchRequest[]>;
}

interface KafkaMessageLocation {
  offset: string;
  partition: number;
}

export class Queue implements IQueue {
  private producer: ProducerFactory;
  private consumer: ConsumerFactory;
  private offsetMap: Map<string, KafkaMessageLocation>;

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
    kafka.createTopicIfNotPresent(() => {
      this.producer.start();
      this.consumer.start();
    });
  }

  public async add(request: IMatchRequest): Promise<IMatchResponse> {
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

  public async getRequests(): Promise<IMatchRequest[]> {
    // return all requests in the queue
    const messages: KafkaMessage[] = await this.consumer.getMessages();
    return messages.flatMap((message) => {
      return JSON.parse(message.value?.toString() ?? "");
    });
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
      console.log("Offset map: ", this.offsetMap);
    }
  }

  private onCommitSuccess(username: string) {
    this.offsetMap.delete(username);
    console.log("Successfully removed request from queue");
  }
}
