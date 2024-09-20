// apps/backend/api-gateway/src/questions/questions.controller.ts

import { Controller, Get, Param, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('questions')
export class QuestionsController {
  constructor(
    @Inject('QUESTIONS_SERVICE')
    private readonly questionsServiceClient: ClientProxy,
  ) {}

  @Get(':id')
  async getQuestionById(@Param('id') id: string) {
    return this.questionsServiceClient.send({ cmd: 'get_question' }, id);
  }
}
