
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateQuestionSubmissionDto } from './dto/create-question-submission.dto';
import { UpdateQuestionSubmissionDto } from './dto/update-question-submission.dto';
import { QuestionSubmission } from './schemas/question-history.schema';
import { QuestionHistoryDB } from './question-history.model'; 
import { Session, SessionDocument } from './schemas/session.schema';

@Injectable()
export class QuestionHistoryService {
  
  constructor(
      // private readonly questionHistoryDB: QuestionHistoryDB,
      @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    ) {}

    // async create(CreateQuestionSubmissionDto: CreateQuestionSubmissionDto): Promise<QuestionSubmission> {
    //   return this.questionHistoryDB.createQuestionSubmission(CreateQuestionSubmissionDto);
    // }
    // async update(id: string, UpdateQuestionSubmissionDto: UpdateQuestionSubmissionDto): Promise<QuestionSubmission> {
    //   return this.questionHistoryDB.updateQuestionSubmission(id, UpdateQuestionSubmissionDto);
    // }
    // async findAll(): Promise<QuestionSubmission[]> {
    //   return this.questionHistoryDB.getAllQuestionSubmissions();
    // }
    // async findAllInSession(sessionId: string): Promise<QuestionSubmission[]> {
    //   return this.questionHistoryDB.getQuestionSubmissionsBySession(sessionId);
    // }
    // async findOne(sessionId: string, questionId: string): Promise<QuestionSubmission> {
    //   return this.questionHistoryDB.getSingleQuestionSubmission(sessionId, questionId);
    // }

    async getSessionById(sessionId: string): Promise<Session | null> {
      return this.sessionModel.findOne({ sessionId }).exec();
    }
    async getAllSessions(): Promise<Session[]> {
      return this.sessionModel.find().exec();
    }
  }

