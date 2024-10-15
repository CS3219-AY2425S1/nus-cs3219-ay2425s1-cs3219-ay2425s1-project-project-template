import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Consumer, Kafka, Producer } from 'kafkajs';
import { MatchRequestDto } from 'src/dto/request.dto';


@Injectable()
export class MatchingService implements OnModuleInit {
  private readonly kafkaBrokerUri: string;
  private readonly consumerGroupId: string;
  private readonly kafka: Kafka;
  private readonly producer: Producer;
  private readonly consumer: Consumer;
  private matches: { [userId: string]: string } = {}; // In-memory store for matches

  constructor(private configService: ConfigService) {
    this.kafkaBrokerUri = this.getKafkaBrokerUri();
    this.consumerGroupId = this.getConsumerGroupId();

    this.kafka = new Kafka({
      clientId: 'matching-service',
      brokers: [this.kafkaBrokerUri],
    });

    // allowAutoTopicCreation: true // it is true by default
    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: this.consumerGroupId });
  }

  async onModuleInit() {
    await this.producer.connect();
    await this.consumer.connect();
  }

  getKafkaBrokerUri(): string {
    return this.configService.get<string>('config.kafkaBrokerUri');
  }

  getConsumerGroupId(): string {
    return this.configService.get<string>('config.consumerGroupId');
  }

  async testReceiveLoop() {
    await this.consumer.subscribe({ topics: ['test-topic'], fromBeginning: false });

    await this.consumer.run({
      autoCommit: false,
      eachMessage: async ({ topic, partition, message }) => {
        console.log("Message received:");
        console.log({
          topic: topic,
          partition: partition,
          value: message.value.toString(),
        });
        const offset = parseInt(message.offset)
        console.log(`Committing offset ${offset + 1}`);
        await this.consumer.commitOffsets([
          { topic: topic, partition: partition, offset: (offset + 1).toString() }
        ]);
      }
    });
  }
  
  // purely for testing
  async sendTestMessage(msg: string) {
    await this.producer.send({
      topic: 'test-topic',
      messages: [{ value: msg }],
    });
  }

  async addMatchRequest(req: MatchRequestDto) {
    var kafkaTopic = `${req.difficulty}-${req.topic}`;
    var msg = `${req.userId}-${req.timestamp}`;
    console.log("Topic is: ", kafkaTopic);
    // Add message
    await this.producer.send({
      topic: kafkaTopic,
      messages: [{value: msg}]
    });
  }

}
