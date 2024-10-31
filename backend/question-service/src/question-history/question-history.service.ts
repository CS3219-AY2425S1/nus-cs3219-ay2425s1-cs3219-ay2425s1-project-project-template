
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

    async create(createQuestionHistoryDto: CreateQuestionHistoryDto): Promise<QuestionHistory> {
      return this.questionHistoryDB.createQuestionHistory(createQuestionHistoryDto);
    }
    async update(id: string, updateQuestionHistoryDto: UpdateQuestionHistoryDto): Promise<QuestionHistory> {
      return this.questionHistoryDB.updateQuestionHistory(id, updateQuestionHistoryDto);
    }
    async findAll(): Promise<QuestionHistory[]> {
      return this.questionHistoryDB.getAllQuestionHistory();
    }
    async findAllInSession(sessionId: string): Promise<QuestionHistory[]> {
      return this.questionHistoryDB.getQuestionHistoryBySession(sessionId);
    }
    async findOne(sessionId: string, questionId: string): Promise<QuestionHistory> {
      return this.questionHistoryDB.getSingleQuestionHistory(sessionId, questionId);
    }
  }

