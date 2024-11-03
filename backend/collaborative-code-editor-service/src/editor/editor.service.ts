import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session, SessionDocument } from './schemas/session.schema';
import { QuestionAttempt } from './schemas/question-attempt.schema';
import { QuestionSubmission } from './schemas/question-submission.schema';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EditorService {
  private readonly redis: Redis;

  constructor(
    @InjectModel(Session.name) private sessionModel: Model<SessionDocument>,
    private configService: ConfigService,
  ) {
    this.redis = new Redis({
      host: configService.get('REDIS_HOST', 'localhost'),
      port: configService.get('REDIS_PORT', 6379),
    });
  }

  async getSession(sessionId: string): Promise<Session | null> {
    const cachedSession = await this.redis.get(`session:${sessionId}`);
    if (cachedSession) {
      return JSON.parse(cachedSession);
    }

    const session = await this.sessionModel.findOne({ sessionId }).exec();
    if (session) {
      await this.redis.setex(
        `session:${sessionId}`,
        3600,
        JSON.stringify(session)
      );
    }
    return session;
  }

  async createQuestionAttempt(
    sessionId: string,
    questionId: string,
  ): Promise<QuestionAttempt> {
    // TODO: Add default current language in some config file
    const questionAttempt: QuestionAttempt = {
      questionId,
      sessionId,
      submissions: [],
      startedAt: new Date(),
      currentCode: '',
      currentLanguage: 'javascript',
    };

    await this.sessionModel.updateOne(
      { sessionId },
      {
        $push: { questionAttempts: questionAttempt },
        $set: { lastModified: new Date() }
      }
    );

    // Invalidate cache
    await this.redis.del(`session:${sessionId}`);

    return questionAttempt;
  }

  async updateQuestionCode(
    sessionId: string,
    questionId: string,
    code: string,
    language: string
  ): Promise<void> {
    await this.sessionModel.updateOne(
      {
        sessionId,
        'questionAttempts.questionId': questionId
      },
      {
        $set: {
          'questionAttempts.$.currentCode': code,
          'questionAttempts.$.currentLanguage': language,
          lastModified: new Date()
        }
      }
    );

    // Update in Redis
    await this.redis.setex(
      `session:${sessionId}:question:${questionId}:code`,
      3600,
      JSON.stringify({ code, language })
    );
  }

  async submitQuestionAttempt(
    sessionId: string,
    questionId: string,
    submission: Partial<QuestionSubmission>
  ): Promise<void> {
    const newSubmission: QuestionSubmission = {
      code: submission.code,
      language: submission.language,
      submittedBy: submission.submittedBy,
      submittedAt: new Date(),
      status: 'pending',
    } as QuestionSubmission;

    await this.sessionModel.updateOne(
      {
        sessionId,
        'questionAttempts.questionId': questionId
      },
      {
        $push: { 'questionAttempts.$.submissions': newSubmission },
        $set: { lastModified: new Date() }
      }
    );

    // Invalidate cache
    await this.redis.del(`session:${sessionId}`);
  }

  async addUserToSession(sessionId: string, userId: string): Promise<void> {
    await this.sessionModel.updateOne(
      { sessionId },
      {
        $addToSet: { activeUsers: userId },
        $setOnInsert: { questionAttempts: [] }
      },
      { upsert: true }
    );

    await this.redis.sadd(`session:${sessionId}:users`, userId);
  }

  async removeUserFromSession(sessionId: string, userId: string): Promise<void> {
    await this.sessionModel.updateOne(
      { sessionId },
      { $pull: { activeUsers: userId } }
    );

    await this.redis.srem(`session:${sessionId}:users`, userId);
  }

  async getActiveUsers(sessionId: string): Promise<string[]> {
    const users = await this.redis.smembers(`session:${sessionId}:users`);
    return users;
  }
}