import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateQuestionHistoryDto } from './dto/create-question-history.dto';
import { QuestionHistory, QuestionHistoryDocument } from './schemas/question-history.schema';

@Injectable()
export class QuestionHistoryDB {
  constructor(
    @InjectModel(QuestionHistory.name) private questionHistoryModel: Model<QuestionHistoryDocument>,
  ) {}

  async logQuestionAttempt(createQuestionHistoryDto: CreateQuestionHistoryDto): Promise<QuestionHistory> {
    const questionHistory = new this.questionHistoryModel(createQuestionHistoryDto);
    return questionHistory.save();
  }
  async getAllQuestionHistory(): Promise<QuestionHistory[]> {
    return this.questionHistoryModel.find().exec();
  }
  async getQuestionHistoryByUser(userId: string): Promise<QuestionHistory[]> {
    return this.questionHistoryModel.find({ userId }).exec();
  }
}