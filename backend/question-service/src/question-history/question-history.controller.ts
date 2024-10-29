import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { QuestionHistoryService } from './question-history.service';
import { CreateQuestionHistoryDto } from './dto/create-question-history.dto';

@Controller('questionhistories')
export class QuestionHistoryController {
  constructor(private readonly questionHistoryService: QuestionHistoryService) {}

  @Post()
  async logQuestionAttempt(@Body() createQuestionHistoryDto: CreateQuestionHistoryDto) {
    return this.questionHistoryService.logQuestionAttempt(createQuestionHistoryDto);
  }
  @Get()
  async getAllQuestionHistory() {
    // this.logger.log('getAllQuestionHistory called');
    return this.questionHistoryService.getAllQuestionHistory();
  }
  @Get(':userId')
  async getQuestionHistoryByUser(@Param('userId') userId: string) {
    return this.questionHistoryService.getQuestionHistoryByUser(userId);
  }
}