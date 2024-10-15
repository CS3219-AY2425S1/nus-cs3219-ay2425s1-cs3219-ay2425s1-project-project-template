import { Controller, Get, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { MatchingService } from './services/matching.service';
import { MatchRequestDto, MatchResponse } from './dto/request.dto';

@Controller()
export class AppController {
  
  constructor(private readonly matchService: MatchingService) {
    // For testing
    matchService.testReceiveLoop();
  }

  @ApiResponse({ status: 200 })
  @Get('test-send')
  async testSend() {
    await this.matchService.sendTestMessage('Hello KafkaJS user!');
    return 'Message sent!';
  }

  @ApiResponse({ status: 200 })
  @Post('match')
  @UsePipes(new ValidationPipe({ transform: true }))
  async match(@Body() body: MatchRequestDto): Promise<MatchResponse> {
    try {
      await this.matchService.addMatchRequest(body);

      return {
        message: `Match request received for ${body.userId} on time: ${body.timestamp}`,
      };
    } catch (error) {
      console.error('Error processing match request:', error);
      return {
        message: `Match request received for ${body.userId} on time: ${body.timestamp}`,
        error: error,
      };
    }
  }

  // TODO: Implement Kafka consumer
  @Get('check-match')
  async checkMatch(): Promise<void> {

  }
}
