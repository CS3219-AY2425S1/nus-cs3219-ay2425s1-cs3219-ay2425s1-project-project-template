
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateQuestionHistoryDto } from './dto/create-question-history.dto';
import { QuestionHistory } from './schemas/question-history.schema';
import { QuestionHistoryDB } from './question-history.model'; 

@Injectable()
export class QuestionHistoryService {
  constructor(
    @InjectModel(QuestionHistory.name) private questionHistoryModel: Model<QuestionHistory>,
    private readonly questionHistoryDB: QuestionHistoryDB, // Injecting QuestionHistoryDB
  ) {}

  async logQuestionAttempt(createQuestionHistoryDto: CreateQuestionHistoryDto): Promise<QuestionHistory> {
    return this.questionHistoryDB.logQuestionAttempt(createQuestionHistoryDto);
  }

  async getAllQuestionHistory(): Promise<QuestionHistory[]> {
    return this.questionHistoryDB.getAllQuestionHistory();
  }

  async getQuestionHistoryByUser(userId: string): Promise<QuestionHistory[]> {
    return this.questionHistoryDB.getQuestionHistoryByUser(userId);
  }
}






// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { CreateQuestionHistoryDto } from './dto/create-question-history.dto';
// import { QuestionHistory } from './schemas/question-history.schema';

// @Injectable()
// export class QuestionHistoryService {
//   constructor(
//     @InjectModel(QuestionHistory.name) private questionHistoryModel: Model<QuestionHistory>,
//   ) {}

//   async logQuestionAttempt(createQuestionHistoryDto: CreateQuestionHistoryDto): Promise<QuestionHistory> {
//     const questionHistory = new this.questionHistoryModel(createQuestionHistoryDto);
//     return questionHistory.save();
//   }
//   async getAllQuestionHistory(): Promise<QuestionHistory[]> {
//     return this.questionHistoryModel.getAllQuestionHistory();
//   }
//   async getQuestionHistoryByUser(userId: string): Promise<QuestionHistory[]> {
//     return this.questionHistoryModel.find({ userId }).exec();
//   }
// }

