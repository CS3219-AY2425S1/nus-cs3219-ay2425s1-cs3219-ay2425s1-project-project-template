import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Session, SessionDocument } from './schemas/session.schema';
import { QuestionAttempt } from './schemas/question-attempt.schema';
import { ExecutionResults, QuestionSubmission } from './schemas/question-submission.schema';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { stringify } from 'querystring';

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

  async getSessionIfActive(sessionId: string): Promise<Session | null> {
    // const cachedSession = await this.redis.get(`session:${sessionId}`);
    // if (cachedSession) {
    //   return JSON.parse(cachedSession);
    // }

    const session = await this.sessionModel.findOne({ sessionId, isCompleted: false }).exec();
    if (session) {
      await this.redis.setex(
        `session:${sessionId}`,
        3600,
        JSON.stringify(session)
      );
      return session;
    }
    return null;
  }

  async getSession(sessionId: string): Promise<Session | null> {
    // const cachedSession = await this.redis.get(`session:${sessionId}`);
    // if (cachedSession) {
    //   return JSON.parse(cachedSession);
    // }

    const session = await this.sessionModel.findOne({ sessionId }).exec();
    if (session) {
      await this.redis.setex(
        `session:${sessionId}`,
        3600,
        JSON.stringify(session)
      );
      return session;
    }
    return null;
  }

  async getAllSessions(): Promise<Session[]> {
    const sessions = await this.sessionModel.find().exec();
    return sessions;
  }

  async getLastSubmissionExecutionResult(sessionId: string, questionId: string): Promise<QuestionSubmission | null> {
    const session = await this.getSession(sessionId);
    if (!session) {
      return null;
    }
    const questionAttempt = session.questionAttempts.find(
      (attempt) => attempt.questionId === questionId
    );
    if (!questionAttempt) {
      return null;
    }
    const lastSubmission = questionAttempt.submissions[questionAttempt.submissions.length - 1];
    if (!lastSubmission) {
      return null;
    }
    return lastSubmission;
  }

  async updateLastSubmission(
    sessionId: string,
    questionId: string,
    status: 'pending' | 'accepted' | 'rejected',
    executionResults: ExecutionResults,
  ): Promise<QuestionSubmission> {
    const session = await this.sessionModel.findOne({ sessionId }).exec();
    if (!session) {
      throw new Error(`Session not found for ID: ${sessionId}`);
    }

    const questionAttempt = session.questionAttempts.find(
      (attempt) => attempt.questionId === questionId,
    );
    if (!questionAttempt) {
      throw new Error(`Question attempt not found for ID: ${questionId}`);
    }

    const lastSubmission =
      questionAttempt.submissions[questionAttempt.submissions.length - 1];
    if (!lastSubmission) {
      throw new Error(`No submission found for question: ${questionId}`);
    }

    lastSubmission.status = status;
    lastSubmission.executionResults = executionResults;

    await session.save();

    // Invalidate cache
    await this.redis.del(`session:${sessionId}`);
    return lastSubmission;
  }

  // TODO: Remove later
  async createSessionIfNotCompleted(sessionId: string): Promise<Session> {
    const existingSession = await this.sessionModel.findOne({ sessionId, isCompleted: true }).exec();
    if (existingSession) {
      return null;
    }
    const session = new this.sessionModel({
      sessionId,
      activeUsers: [],
      allUsers: [],
      questionAttempts: [],
    });
    await session.save();

    // Add session to cache
    await this.redis.setex(`session:${sessionId}`, 3600, JSON.stringify(session));
    return session;
  }

  async createQuestionAttempt(
    sessionId: string,
    questionId: string,
  ): Promise<QuestionAttempt> {
    // Invalidate cache
    await this.redis.del(`session:${sessionId}`);
    console.log('Creating question attempt', sessionId, questionId);

    // TODO: Add default current language in some config file
    const questionAttempt: QuestionAttempt = {
      questionId,
      submissions: [],
      startedAt: new Date(),
      currentCode: '',
      currentLanguage: 'javascript',
    };

    await this.sessionModel.updateOne(
      { sessionId },
      {
        $push: { questionAttempts: questionAttempt },
      }
    ).exec();

    // Remove multiple question attempts if available
    await this.removMultipleQuestionAttemptsIfAvailable(sessionId, questionId);

    // set time out to remove duplicate question attempts
    setTimeout(async () => {
      await this.removMultipleQuestionAttemptsIfAvailable(sessionId, questionId);
    }, 3000);

    return questionAttempt;
  }

  private async removMultipleQuestionAttemptsIfAvailable(sessionId: string, questionId: string) {
    const session = await this.sessionModel.findOne({ sessionId }).exec();
    if (!session) {
      return;
    }

    const questionAttempt = session.questionAttempts.find(
      (attempt) => attempt.questionId === questionId
    );
    if (!questionAttempt) {
      return;
    }

    const questionAttemptIndices = session.questionAttempts
      .map((qa, i) => (qa.questionId === questionId ? i : null))
      .filter(Number);

    if (questionAttemptIndices.length === 0) {
      return;
    }
    const questionAttemptIndicesExceptLast = questionAttemptIndices.slice(0, questionAttemptIndices.length - 1);

    if (questionAttemptIndicesExceptLast.length > 0) {
      // Attempts except questionAttemptIndicesExceptLast
      const questionAttempts = session.questionAttempts.filter(
        (qa, i) => !questionAttemptIndicesExceptLast.includes(i)
      )
      await this.sessionModel.updateOne(
        { sessionId },
        {
          $set: { questionAttempts },
        }
      ).exec();
    }
  }


  async updateQuestionCode(
    sessionId: string,
    questionId: string,
    code: string,
    language: string
  ): Promise<void> {
    const updatedSession = await this.sessionModel.findOneAndUpdate(
      {
        sessionId,
        'questionAttempts.questionId': questionId
      },
      {
        $set: {
          'questionAttempts.$.currentCode': code,
          'questionAttempts.$.currentLanguage': language,
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedSession) {
      await this.createQuestionAttempt(sessionId, questionId);
      await this.updateQuestionCode(sessionId, questionId, code, language);
    }

    // Update in Redis
    await this.redis.setex(
      `session:${sessionId}:question:${questionId}:code`,
      3600,
      JSON.stringify({ code, language })
    );

    // Invalidate cache
    await this.redis.del(`session:${sessionId}`);
  }

  async submitQuestionAttempt(
    sessionId: string,
    questionId: string,
    submission: Partial<QuestionSubmission>
  ): Promise<void> {
    // TODO: Check if session id and question id already has pending submission
    const newSubmission: QuestionSubmission = {
      code: submission.code,
      language: submission.language,
      submittedAt: new Date(),
    } as QuestionSubmission;

    await this.sessionModel.updateOne(
      {
        sessionId,
        'questionAttempts.questionId': questionId
      },
      {
        $push: { 'questionAttempts.$.submissions': newSubmission },
      }
    );

    // TODO: Add code for executing test cases here, change status of submission

    // Invalidate cache
    await this.redis.del(`session:${sessionId}`);
  }

  async addUserToSession(sessionId: string, userId: string): Promise<void> {
    await this.redis.sadd(`session:${sessionId}:users`, userId);

    await this.sessionModel.updateOne(
      { sessionId },
      {
        $addToSet: { activeUsers: userId, allUsers: userId.split(':')[0] },
        $setOnInsert: { questionAttempts: [] }
      },
      { upsert: true }
    ).exec();

  }

  async removeUserFromSession(sessionId: string, userId: string): Promise<void> {
    await this.redis.srem(`session:${sessionId}:users`, userId);

    await this.sessionModel.updateOne(
      { sessionId },
      { $pull: { activeUsers: userId } }
    ).exec();

  }

  async getActiveUsers(sessionId: string): Promise<string[]> {
    // const cachedUsers = await this.redis.smembers(`session:${sessionId}:users`);
    // if (cachedUsers.length > 0) {
    //   return cachedUsers.map(user => user.split(':')[1]);
    // }

    const session = await this.sessionModel.findOne({ sessionId }).exec();
    if (session && session.activeUsers && session.activeUsers.length > 0) {
      await this.redis.sadd(`session:${sessionId}:users`, ...session.activeUsers);
      return session.activeUsers;
    }

    return [];
  }

  async completeSession(sessionId: string): Promise<void> {
    let noActiveUsers = true;
    for (let i = 0; i < 5; i++) {
      const activeUsers = await this.getActiveUsers(sessionId);
      if (activeUsers.length !== 0) {
        noActiveUsers = false;
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    if (noActiveUsers) {
      await this.sessionModel.updateOne(
        { sessionId },
        { $set: { isCompleted: true } }
      );
    }
  }

  async setActiveUsers(sessionId: string, userIds: string[]): Promise<void> {
    if (userIds.length === 0) {
      await this.redis.del(`session:${sessionId}:users`);
      return;
    }
    await this.redis.sadd(`session:${sessionId}:users`, ...userIds);

    await this.sessionModel.updateOne(
      { sessionId },
      { $set: { activeUsers: userIds } }
    ).exec();
  }
}