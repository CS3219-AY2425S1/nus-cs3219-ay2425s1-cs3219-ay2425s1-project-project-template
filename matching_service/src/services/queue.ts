import dotenv from "dotenv";
import { Kafka } from "kafkajs";
import processMessage, {
  ProducerFactory,
  ConsumerFactory,
  KafkaRequest,
} from "./kafka";

dotenv.config();

export interface IMatchRequest extends KafkaRequest {
  id: string;
  userId: string;
  topic: string;
  difficulty: string;
}

export interface IMatchCancelRequest {
  id: string;
}

export interface IMatchResponse {
  success: boolean;
}

export interface IMatchCancelResponse {
  success: boolean;
}

export interface IMatch {
  roomId: string;
  userIds: string[];
  topic: string;
  difficulty: string;
}

export interface IQueue {
  add(request: IMatchRequest): Promise<IMatchResponse>;
  cancel(request: IMatchCancelRequest): Promise<IMatchCancelResponse>;
  getRequests(): Promise<IMatchRequest[]>;
}

export class Queue implements IQueue {
  private producer: ProducerFactory;
  private consumer: ConsumerFactory;
  private offsetMap: Map<string, string>;

  constructor() {
    // Setup connection to Kafka if using Kafka
    const kafka = new Kafka({
      clientId: "match-queue",
      brokers: [
        `${process.env.KAFKA_BROKER_ROUTE}:${process.env.KAFKA_BROKER_PORT}`,
      ],
    });

    // Setup producer and consumer
    this.producer = new ProducerFactory(kafka, "match-queue");
    this.consumer = new ConsumerFactory(
      processMessage,
      "match-group",
      kafka,
      "match-queue"
    );
    this.offsetMap = new Map();

    this.producer.start();
    this.consumer.start();
  }

  public async add(request: IMatchRequest): Promise<IMatchResponse> {
    // add to queue, then return success message
    this.producer.sendBatch([request]);

    return {
      success: true,
    };
  }

  public async cancel(
    request: IMatchCancelRequest
  ): Promise<IMatchCancelResponse> {
    // remove from queue, then return success message
    const offset = this.offsetMap.get(request.id);
    var success = false;

    if (offset != undefined) {
      success = true;
      this.consumer.commit(offset);
      this.offsetMap.delete(request.id);
    }

    return {
      success: success,
    };
  }

  public async getRequests(): Promise<IMatchRequest[]> {
    // return all requests in the queue
    return [];
  }
}
