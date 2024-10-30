
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateQuestionHistoryDto } from './dto/create-question-history.dto';
import { UpdateQuestionHistoryDto } from './dto/update-question-history.dto';
import { QuestionHistory } from './schemas/question-history.schema';
import { QuestionHistoryDB } from './question-history.model'; 

@Injectable()
export class QuestionHistoryService {
  
  constructor(
      private readonly questionHistoryDB: QuestionHistoryDB,
    ) {}

    async logQuestionAttempt(createQuestionHistoryDto: CreateQuestionHistoryDto): Promise<QuestionHistory> {
      return this.questionHistoryDB.logQuestionAttempt(createQuestionHistoryDto);
    }
    async updateQuestionHistory(id: string, updateQuestionHistoryDto: UpdateQuestionHistoryDto): Promise<QuestionHistory> {
      return this.questionHistoryDB.updateQuestionHistory(id, updateQuestionHistoryDto);
    }
    async getAllQuestionHistory(): Promise<QuestionHistory[]> {
      return this.questionHistoryDB.getAllQuestionHistory();
    }
    async getQuestionHistoryBySession(sessionId: string): Promise<QuestionHistory[]> {
      return this.questionHistoryDB.getQuestionHistoryBySession(sessionId);
    }
  }

