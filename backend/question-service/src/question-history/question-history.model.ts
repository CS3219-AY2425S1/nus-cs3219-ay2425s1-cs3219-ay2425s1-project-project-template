import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateQuestionSubmissionDto } from './dto/create-question-submission.dto';
import { UpdateQuestionSubmissionDto } from './dto/update-question-submission.dto';
import { QuestionSubmission, QuestionSubmissionDocument } from './schemas/question-history.schema';

@Injectable()
export class QuestionHistoryDB {
  constructor(
    @InjectModel(QuestionSubmission.name) private questionHistoryModel: Model<QuestionSubmissionDocument>,
  ) {}

  async createQuestionSubmission(CreateQuestionSubmissionDto: CreateQuestionSubmissionDto): Promise<QuestionSubmission> {
    try {
      const QuestionSubmission = new this.questionHistoryModel(CreateQuestionSubmissionDto);
      return await QuestionSubmission.save();
    } catch (error) {
      throw new InternalServerErrorException(`Failed to create question history`);
    }
  }
  
  async updateQuestionSubmission(id: string, UpdateQuestionSubmissionDto: UpdateQuestionSubmissionDto): Promise<QuestionSubmission> {
    return this.questionHistoryModel.findByIdAndUpdate(id, UpdateQuestionSubmissionDto, { new: true }).exec();
  }
  async getAllQuestionSubmissions(): Promise<QuestionSubmission[]> {
    try {
      const questionSubmissions = await this.questionHistoryModel.find().exec();
      if (!questionSubmissions || questionSubmissions.length === 0) {
        throw new NotFoundException(`No question histories found`);
      }
      return questionSubmissions;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to get all question histories`);
    }
  }
    
  async getQuestionSubmissionsBySession(sessionId: string): Promise<QuestionSubmission[]> {
    try {
      const questionSubmissions = await this.questionHistoryModel.find({ sessionId }).exec();
      if (!questionSubmissions || questionSubmissions.length === 0) {
        throw new NotFoundException(`No question histories found for session ID ${sessionId}`);
      }
      return questionSubmissions;
    } catch (error) {
      throw new InternalServerErrorException(`Failed to get question history for session ID ${sessionId}`);
    }
  }

  async getSingleQuestionSubmission(sessionId: string, questionId: string): Promise<QuestionSubmission> {
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