import { Injectable } from '@nestjs/common';
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

  async logQuestionAttempt(createQuestionHistoryDto: CreateQuestionHistoryDto): Promise<QuestionHistory> {
    const questionHistory = new this.questionHistoryModel(createQuestionHistoryDto);
    return questionHistory.save();
  }
  async updateQuestionHistory(id: string, updateQuestionHistoryDto: UpdateQuestionHistoryDto): Promise<QuestionHistory> {
    return this.questionHistoryModel.findByIdAndUpdate(id, updateQuestionHistoryDto, { new: true }).exec();
  }
  async getAllQuestionHistory(): Promise<QuestionHistory[]> {
    return this.questionHistoryModel.find().exec();
  }
  async getQuestionHistoryBySession(sessionId: string): Promise<QuestionHistory[]> {
    return this.questionHistoryModel.find({ sessionId }).exec();
  }
}
  // constructor(
  //   @InjectModel(QuestionHistory.name) private questionHistoryModel: Model<QuestionHistory>,
  //   private readonly questionHistoryDB: QuestionHistoryDB, // Injecting QuestionHistoryDB
  // ) {}

  // async logQuestionAttempt(createQuestionHistoryDto: CreateQuestionHistoryDto): Promise<QuestionHistory> {
  //   return this.questionHistoryDB.logQuestionAttempt(createQuestionHistoryDto);
  // }

  // async getAllQuestionHistory(): Promise<QuestionHistory[]> {
  //   return this.questionHistoryDB.getAllQuestionHistory();
  // }

  // async getQuestionHistoryByUser(userId: string): Promise<QuestionHistory[]> {
  //   return this.questionHistoryDB.getQuestionHistoryByUser(userId);
  // }
  // }