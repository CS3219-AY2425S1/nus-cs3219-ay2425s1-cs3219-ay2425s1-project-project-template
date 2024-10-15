import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { MatchingService } from './services/matching.services';
import { MatchRequestDto } from './dto/request.dto';

@Controller()
export class AppController {
  

  constructor(private readonly matchService: MatchingService) {
    // For testing
    matchService.testReceiveLoop();
  }

  @ApiResponse({ status: 200 })
  @Get('test-send')
  async testSend() {
    await this.matchService.sendTestMessage({
      topic: 'test-topic',
      messages: [{ value: 'Hello KafkaJS user!' }],
    });
    return 'Message sent!';
  }

  // TODO: Implement Kafka producer [userId, topic, difficulty, time]
  @Post('match')
  async match(@Body('message') body: MatchRequestDto): Promise<void> {
    return this.matchService.addMatchRequest(body);
  }

  // TODO: Implement Kafka consumer
  @Get('check-match')
  async checkMatch(): Promise<void> {

  }
}
