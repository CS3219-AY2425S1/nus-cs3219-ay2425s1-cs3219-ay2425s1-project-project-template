import { Controller, UsePipes } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { QuestionsService } from './questions.service';
import { ZodValidationPipe } from '@repo/pipes/zod-validation-pipe.pipe';
import { CreateQuestionDto, createQuestionSchema } from '@repo/dtos/questions';
@Controller()
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @MessagePattern({ cmd: 'get_question' })
  getQuestion(id: string) {
    return this.questionsService.findById(id);
  }

  @MessagePattern({ cmd: 'create_question' })
  @UsePipes(new ZodValidationPipe(createQuestionSchema))
  async create(@Payload() createQuestionDto: CreateQuestionDto) {
    return createQuestionDto;
  }
}
