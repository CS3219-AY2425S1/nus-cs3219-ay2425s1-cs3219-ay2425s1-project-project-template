import { Controller, Post, Body, Get, Param, Patch, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { QuestionHistoryService } from './question-history.service';
import { CreateQuestionHistoryDto } from './dto/create-question-history.dto';
import { UpdateQuestionHistoryDto } from './dto/update-question-history.dto';

@Controller('questionhistories')
export class QuestionHistoryController {
  constructor(private readonly questionHistoryService: QuestionHistoryService) {}

  @Post()
  async createQuestionHistory(@Body() createQuestionHistoryDto: CreateQuestionHistoryDto) {
    try {
      return await this.questionHistoryService.create(createQuestionHistoryDto);
    } catch (error) {
      throw new InternalServerErrorException(`Failed to log question attempt`);
    }
  }

  @Patch(':id')
  async updateQuestionHistory(@Param('id') id: string, @Body() updateQuestionHistoryDto: UpdateQuestionHistoryDto) {
    try {
      return await this.questionHistoryService.update(id, updateQuestionHistoryDto);
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