import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './schemas/question.schema';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  create(@Body() createQuestionDto: CreateQuestionDto): Promise<Question> {
    return this.questionsService.create(createQuestionDto);
  }

  @Get()
  findAll(): Promise<Partial<Question>[]> {
    return this.questionsService.findAll();
  }

  @Get(':questionId')
  findOne(@Param('questionId') questionId: string): Promise<Question> {
    return this.questionsService.findOne(questionId);
  }

  @Patch(':questionId')
  update(
    @Param('questionId') questionId: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ): Promise<Question> {
    return this.questionsService.update(questionId, updateQuestionDto);
  }

  @Delete(':questionId')
  remove(@Param('questionId') questionId: string): Promise<Question> {
    return this.questionsService.remove(questionId);
  }
}
