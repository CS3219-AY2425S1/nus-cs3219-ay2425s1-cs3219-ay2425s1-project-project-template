import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Consumer, Kafka, Producer } from 'kafkajs';
import { MatchRequest, MatchResponse } from './dto/request.dto';

enum MessageAction {
  REQUEST_MATCH = 'REQUEST_MATCH',
  CANCEL_MATCH = 'CANCEL_MATCH'
}

type MatchMessage = {
  userId1: string;
  userId2: string;
  matchedTopic: string;
  matchedRoom: string;
}

@Injectable()
export class MatchingWebSocketService implements OnModuleInit {
  private readonly REQUEST_TIMEOUT = 30000; // epoch time 30s
  private readonly kafkaBrokerUri: string;
  private readonly consumerGroupId: string;
  private readonly kafka: Kafka;
  private readonly producer: Producer;
  private readonly consumer: Consumer;

  private readonly socketIdReqMap: {
    [socketId: string]: {
      kafkaTopic: string;
      userId: string;
      timestamp: number
    }
  } = {};

  constructor(private configService: ConfigService) {
    this.kafkaBrokerUri = this.getKafkaBrokerUri();
    this.consumerGroupId = this.getConsumerGroupId();
    this.kafka = new Kafka({
      clientId: 'matching-websocket-service',
      brokers: [this.kafkaBrokerUri],
    });

    // allowAutoTopicCreation: true // it is true by default
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: this.consumerGroupId });
  }

  async onModuleInit() {
    await this.producer.connect();
    await this.consumer.connect();
    await this.subscribeToTopics();
    // Consume message loop
    this.consumeMessages();
  }

  private async subscribeToTopics() {
    await this.consumer.subscribe({ topic: 'matches' });
  }

  private consumeMessages() {
    this.consumer.run({
      eachMessage: async ({ topic, message }) => {
        const messageString = message.value.toString();
        const messageBody: MatchMessage = JSON.parse(messageString);

        console.log(`Received message from topic ${topic}:`, messageBody);
        // TODO Notify both users of match using userID to socket mapping
      },
    })
  }

  async addMatchRequest(req: MatchRequest): Promise<MatchResponse> {
    // TODO Perform atomic set on Redis to see if user is already in the pool
    // If an existing entry exists for the user, return an error

    const kafkaTopic = `${req.difficulty}-${req.topic}`;
    const currentTime = Date.now();
    const expiryTime = currentTime + this.REQUEST_TIMEOUT;
    await this.producer.send({
      topic: kafkaTopic,
      messages: [{value: JSON.stringify({
          action: MessageAction.REQUEST_MATCH,
          userId: req.userId,
          timestamp: currentTime,
          expiryTime: expiryTime
        })}]
    });
    return {
      message: `Match Request received for ${req.userId} at ${currentTime}`,
    }
  }

  async cancelMatchRequest(socketId: string) {
    const req = this.socketIdReqMap[socketId];
    await this.producer.send({
      topic: req.kafkaTopic,
      messages: [{value: JSON.stringify({
          action: MessageAction.CANCEL_MATCH,
          userId: req.userId,
          timestamp: req.timestamp
        })}]
    });
  }

  private getKafkaBrokerUri(): string {
    return this.configService.get<string>('config.kafkaBrokerUri');
  }

  private getConsumerGroupId(): string {
    return this.configService.get<string>('config.consumerGroupId');
  }
}
