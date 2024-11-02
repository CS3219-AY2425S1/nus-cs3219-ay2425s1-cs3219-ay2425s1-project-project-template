import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateQuestionSubmissionDto } from './dto/create-question-submission.dto';
import { UpdateQuestionSubmissionDto } from './dto/update-question-submission.dto';
import { QuestionSubmission, QuestionHistoryDocument } from './schemas/question-history.schema';

@Injectable()
export class QuestionHistoryDB {
  constructor(
    @InjectModel(QuestionSubmission.name) private questionHistoryModel: Model<QuestionHistoryDocument>,
  ) {}

  async createQuestionHistory(CreateQuestionSubmissionDto: CreateQuestionSubmissionDto): Promise<QuestionSubmission> {
    // const QuestionSubmission = new this.questionHistoryModel(CreateQuestionSubmissionDto);
    // return QuestionSubmission.save();
    try {
      const QuestionSubmission = new this.questionHistoryModel(CreateQuestionSubmissionDto);
      return await QuestionSubmission.save();
    } catch (error) {
      throw new InternalServerErrorException(`Failed to create question history`);
    }
  }
  
  async updateQuestionHistory(id: string, UpdateQuestionSubmissionDto: UpdateQuestionSubmissionDto): Promise<QuestionSubmission> {
    return this.questionHistoryModel.findByIdAndUpdate(id, UpdateQuestionSubmissionDto, { new: true }).exec();
  }
  async getAllQuestionHistory(): Promise<QuestionSubmission[]> {
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
    
  async getQuestionHistoryBySession(sessionId: string): Promise<QuestionSubmission[]> {
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

  async getSingleQuestionHistory(sessionId: string, questionId: string): Promise<QuestionSubmission> {
    try {
      const QuestionSubmission = await this.questionHistoryModel.findOne({ sessionId, questionId }).exec();
      if (!QuestionSubmission) {
        throw new NotFoundException(`Question history not found for sessionId ${sessionId} and questionId ${questionId}`);
      }
      return QuestionSubmission;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to get question history for sessionId ${sessionId} and questionId ${questionId}`);
    }
  }
}