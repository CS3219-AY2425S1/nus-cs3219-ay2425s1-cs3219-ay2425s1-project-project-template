import { Controller, Post, Body, Get, Param, Patch, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { QuestionHistoryService } from './question-history.service';
import { CreateQuestionSubmissionDto } from './dto/create-question-submission.dto';
import { UpdateQuestionSubmissionDto } from './dto/update-question-submission.dto';

@Controller('questionhistories')
export class QuestionHistoryController {
  constructor(private readonly questionHistoryService: QuestionHistoryService) {}

  @Post()
  async createQuestionHistory(@Body() CreateQuestionSubmissionDto: CreateQuestionSubmissionDto) {
    try {
      return await this.questionHistoryService.create(CreateQuestionSubmissionDto);
    } catch (error) {
      throw new InternalServerErrorException(`Failed to log question attempt`);
    }
  }

  @Patch(':id')
  async updateQuestionHistory(@Param('id') id: string, @Body() UpdateQuestionSubmissionDto: UpdateQuestionSubmissionDto) {
    try {
      return await this.questionHistoryService.update(id, UpdateQuestionSubmissionDto);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to update question history with ID ${id}`);
    }
  }

  @Get()
  async getAllQuestionHistory() {
    try {
      return await this.questionHistoryService.findAll();
    } catch (error) {
      throw new InternalServerErrorException(`Failed to get all question histories`);
    }
  }

  @Get(':sessionId')
  async getQuestionHistoryBySession(@Param('sessionId') sessionId: string) {
    try {
      return await this.questionHistoryService.findAllInSession(sessionId);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to get question history for session ID ${sessionId}`);
    }
  }

  @Get(':sessionId/:questionId')
  async getSingleQuestionHistory(@Param('sessionId') sessionId: string, @Param('questionId') questionId: string) {
    try {
      // change to look for active question history?
      return await this.questionHistoryService.findOne(sessionId, questionId);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(`Failed to get question history for session ID ${sessionId} and question ID ${questionId}`);
    }
  }
}