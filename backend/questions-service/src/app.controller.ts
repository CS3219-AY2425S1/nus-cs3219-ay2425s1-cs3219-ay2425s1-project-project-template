import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  CreateQuestionDto,
  FindQuestionBySlugDto,
  GetQuestionsDto,
} from './dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'get_questions' })
  async getQuestions(@Payload() data: GetQuestionsDto) {
    const { page, limit, query, difficulty, categories } = data;
    return this.appService.getQuestions(
      page,
      limit,
      query,
      difficulty,
      categories,
    );
  }

  @MessagePattern({ cmd: 'get_question_details' })
  async getQuestionDetailBySlug(@Payload() data: FindQuestionBySlugDto) {
    const { slug } = data;
    return this.appService.getQuestionDetailsBySlug(slug);
  }

  @MessagePattern({ cmd: 'create_question' })
  async createQuestion(@Payload() data: CreateQuestionDto) {
    return this.appService.createQuestion(data);
  }

  @MessagePattern({ cmd: 'delete_question' })
  async deleteQuestion(@Payload() id: string) {
    return this.appService.deleteQuestion(id);
  }
}
