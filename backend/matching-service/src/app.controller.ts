import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  private readonly kafkaBrokerId: string;

  constructor(private readonly appService: AppService) {
    this.kafkaBrokerId = this.appService.getKafkaBrokerId();

    // TODO: Connect to Kafka
    
  }


  // TODO: Implement Kafka producer [userId, topic, difficulty, time]
  @Post('match')
  async match(@Body('message') body: string): Promise<void> {
   
  }

  // TODO: Implement Kafka consumer
  @Get('check-match')
  async checkMatch(): Promise<void> {

  }
}
