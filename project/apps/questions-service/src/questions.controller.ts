import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { QuestionsService } from './questions.service';

@Controller()
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @MessagePattern({ cmd: 'get_question' })
  getQuestion(id: string) {
    return this.questionsService.findById(id);
  }
}
