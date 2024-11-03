import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CONFIG } from './redis.config';

@Injectable()
export class CollabRedisService implements OnModuleInit, OnModuleDestroy {
  private readonly redis: Redis;
  private readonly logger = new Logger(CollabRedisService.name);

  constructor() {
    this.redis = new Redis({
      host: REDIS_CONFIG.host,
      port: REDIS_CONFIG.port as number,
    });
  }

  async onModuleInit() {
    try {
      await this.redis.ping();
      this.logger.log('Redis connection established successfully');
    } catch (error) {
      this.logger.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.redis.quit();
    this.logger.log('Redis connection closed');
  }

  async getCollabSessionData(matchId: string): Promise<any> {
    const key = `${REDIS_CONFIG.keys.sessionQuestion}:${matchId}`;
    const data = await this.redis.get(key);
    this.logger.log(`data from collab redis of matchId ${matchId}: ${data}`);

    return data ? JSON.parse(data) : null;
  }

  async addCollabRecordToRedis(
    matchId: string,
    topic: string,
    difficulty: string,
  ): Promise<void> {
    const key = `${REDIS_CONFIG.keys.sessionQuestion}:${matchId}`;
    const value = {
      question: null,
      webSockets: [],
      topic: topic,
      difficulty: difficulty,
      questionIds: [],
      messages: [],
    };

    await this.redis.set(key, JSON.stringify(value));
    const data = await this.redis.get(key);
    this.logger.log(`added record ${data}`);
  }

  async getCollabQuestion(matchId: string): Promise<any> {
    const value = await this.getCollabSessionData(matchId);
    if (value) {
      return {
        question: value.question || null,
        topic: value.topic || null,
        difficulty: value.difficulty || null,
      };
    }

    return { question: null, topic: null, difficulty: null };
  }

  async getQuestionIds(matchId: string): Promise<string[]> {
    const value = await this.getCollabSessionData(matchId);
    const questionIds = value.questionIds;

    return questionIds ? questionIds : [];
  }

  async updateQuestion(
    matchId: string,
    newQuestion: any,
    topic: string,
    difficulty: string,
  ): Promise<void> {
    const key = `${REDIS_CONFIG.keys.sessionQuestion}:${matchId}`;
    const value = await this.getCollabSessionData(matchId);
    if (value) {
      value.question = newQuestion;
      value.topic = topic;
      value.difficulty = difficulty;
      value.questionIds.push(newQuestion._id);
      await this.redis.set(key, JSON.stringify(value));
    }
  }

  async addWebSocketId(matchId: string, websocketId: string): Promise<void> {
    const key = `${REDIS_CONFIG.keys.sessionQuestion}:${matchId}`;
    const value = await this.getCollabSessionData(matchId);

    if (value) {
      value.webSockets.push(websocketId);
      await this.redis.set(key, JSON.stringify(value));
    }
  }

  async getCollabSessionWebSocketIds(matchId: string): Promise<string[]> {
    const value = await this.getCollabSessionData(matchId);
    const websocketIds = value.webSockets;

    return websocketIds;
  }

  async endSession(matchId: string): Promise<void> {
    const key = `${REDIS_CONFIG.keys.sessionQuestion}:${matchId}`;
    await this.redis.del(key);
  }

  async updateMessage(matchId: string, messageData: any) {
    const key = `${REDIS_CONFIG.keys.sessionQuestion}:${matchId}`;
    const value = await this.getCollabSessionData(matchId);
    if (value) {
      this.logger.debug(messageData);
      value.messages.push(messageData);
      this.logger.debug(`New message pushed ${value}`);
      await this.redis.set(key, JSON.stringify(value));
    }
  }

  // async removeWebSocketId(matchId: string, webSocketId: string): Promise<void> {
  //   const key = `${REDIS_CONFIG.keys.sessionQuestion}:${matchId}`;
  //   const value = await this.getCollabSessionData(matchId);
  //   if (value) {
  //     value.webSockets = value.webSockets.filter(
  //       (id: any) => id !== webSocketId,
  //     );
  //     this.logger.debug(value.webSockets);
  //     await this.redis.set(key, JSON.stringify(value));
  //   }
  // }
}
