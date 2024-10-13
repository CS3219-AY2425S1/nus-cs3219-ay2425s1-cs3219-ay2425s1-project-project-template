import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { Consumer, Kafka, Producer } from 'kafkajs';
import { ApiResponse } from '@nestjs/swagger';
import { MatchingService } from './services/matching.services';
import { MatchRequestDto } from './dto/request.dto';

@Controller()
export class AppController {
  private readonly kafkaBrokerUri: string;
  private readonly consumerGroupId: string;
  private readonly kafka: Kafka;
  private readonly producer: Producer;
  private readonly consumer: Consumer;

  constructor(private readonly appService: AppService) {
    this.kafkaBrokerUri = this.appService.getKafkaBrokerUri();
    this.consumerGroupId = this.appService.getConsumerGroupId();

    this.kafka = new Kafka({
      clientId: 'matching-service',
      brokers: [this.kafkaBrokerUri],
    });

    this.producer = this.kafka.producer();
    this.consumer = this.kafka.consumer({ groupId: this.consumerGroupId });

    this.producer.connect();
    this.consumer.connect();

    this.testReceiveLoop();
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

  @ApiResponse({ status: 200 })
  @Get('test-send')
  async testSend() {
    await this.producer.send({
      topic: 'test-topic',
      messages: [{ value: 'Hello KafkaJS user!' }],
    });
    return 'Message sent!';
  }

  // TODO: Implement Kafka producer [userId, topic, difficulty, time]
  @Post('match')
  async match(@Body('message') body: MatchRequestDto): Promise<void> {
    return this.appService.addMatchRequest(body);
  }

  // TODO: Implement Kafka consumer
  @Get('check-match')
  async checkMatch(): Promise<void> {

  }
}
