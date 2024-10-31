import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateQuestionHistoryDto } from './dto/create-question-history.dto';
import { UpdateQuestionHistoryDto } from './dto/update-question-history.dto';
import { QuestionHistory, QuestionHistoryDocument } from './schemas/question-history.schema';

@Injectable()
export class QuestionHistoryDB {
  constructor(
    @InjectModel(QuestionHistory.name) private questionHistoryModel: Model<QuestionHistoryDocument>,
  ) {}

  async createQuestionHistory(createQuestionHistoryDto: CreateQuestionHistoryDto): Promise<QuestionHistory> {
    // const questionHistory = new this.questionHistoryModel(createQuestionHistoryDto);
    // return questionHistory.save();
    try {
      const questionHistory = new this.questionHistoryModel(createQuestionHistoryDto);
      return await questionHistory.save();
    } catch (error) {
      throw new InternalServerErrorException(`Failed to create question history`);
    }
  }
  
  async updateQuestionHistory(id: string, updateQuestionHistoryDto: UpdateQuestionHistoryDto): Promise<QuestionHistory> {
    return this.questionHistoryModel.findByIdAndUpdate(id, updateQuestionHistoryDto, { new: true }).exec();
  }
  async getAllQuestionHistory(): Promise<QuestionHistory[]> {
    try {
      const questionHistories = await this.questionHistoryModel.find().exec();
      if (!questionHistories || questionHistories.length === 0) {
        throw new NotFoundException(`No question histories found`);
      }
      return questionHistories;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to get all question histories`);
    }
  }
    
  async getQuestionHistoryBySession(sessionId: string): Promise<QuestionHistory[]> {
    try {
      const questionHistories = await this.questionHistoryModel.find({ sessionId }).exec();
      if (!questionHistories || questionHistories.length === 0) {
        throw new NotFoundException(`No question histories found for session ID ${sessionId}`);
      }
      return questionHistories;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to get question history for session ID ${sessionId}`);
    }
  }

  async getSingleQuestionHistory(sessionId: string, questionId: string): Promise<QuestionHistory> {
    try {
      const questionHistory = await this.questionHistoryModel.findOne({ sessionId, questionId }).exec();
      if (!questionHistory) {
        throw new NotFoundException(`Question history not found for sessionId ${sessionId} and questionId ${questionId}`);
      }
      return questionHistory;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to get question history for sessionId ${sessionId} and questionId ${questionId}`);
    }
  }
}