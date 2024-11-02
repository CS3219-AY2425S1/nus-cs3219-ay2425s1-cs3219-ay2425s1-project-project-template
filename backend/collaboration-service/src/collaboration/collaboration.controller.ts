import { Controller, Post, Body, Param } from '@nestjs/common';
import { CollabService } from './collaboration.service';

@Controller('collaboration')
export class CollabController {
  constructor(private readonly collabService: CollabService) {}

  @Post('create-session/:matchId')
  async createSession(
    @Param('matchId') matchId: string,
    @Body() body: { topic: string; difficulty: string },
  ) {
    const { topic, difficulty } = body;

    const initQuestion = await this.collabService.createSessionRecord(
      matchId,
      difficulty,
      topic,
    );

    return {
      matchId,
      initQuestion,
    };
  }
}
