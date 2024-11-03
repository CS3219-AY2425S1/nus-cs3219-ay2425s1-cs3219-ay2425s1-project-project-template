import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { CollabRedisService } from 'src/redis/redis.service';

@Injectable()
export class CollabService {
  private readonly logger = new Logger(CollabService.name);

  constructor(
    private readonly collabRedisService: CollabRedisService,
    private readonly httpService: HttpService,
  ) {}

  async getCollabSessionWebSockets(matchId: string): Promise<string[]> {
    const data =
      await this.collabRedisService.getCollabSessionWebSocketIds(matchId);

    return data;
  }

  async getSessionQuestion(matchId: string): Promise<any> {
    const data = await this.collabRedisService.getCollabQuestion(matchId);

    return data;
  }

  async registerWSToSession(matchId: string, id: string): Promise<void> {
    await this.collabRedisService.addWebSocketId(matchId, id);
    this.logger.log(`WebSocket ID ${id} registered for session ${matchId}`);
  }

  async updateSessionQuestion(
    matchId: string,
    topic: string,
    difficulty: string,
  ): Promise<any> {
    const idsToExclude = await this.collabRedisService.getQuestionIds(matchId);
    const requestBody = {
      category: topic,
      complexity: difficulty,
      idsToExclude: idsToExclude,
    };
    try {
      this.logger.debug(`Request body for calling question collab: ${JSON.stringify(requestBody, null, 2)}`);
      const response = await this.httpService
        .post('http://host.docker.internal:8000/questions/collab', requestBody)
        .toPromise();

      const newQuestion = response.data;
      if (newQuestion) {
        await this.collabRedisService.updateQuestion(
          matchId,
          newQuestion,
          topic,
          difficulty,
        );
      }

      return newQuestion;
    } catch (error) {
      this.logger.error(
        `Failed to call question endpoint for collab`,
        error.message,
      );
      return null;
    }
  }

  async createSessionRecord(
    matchId: string,
    difficulty: string,
    topic: string,
  ): Promise<any> {
    await this.collabRedisService.addCollabRecordToRedis(
      matchId,
      topic,
      difficulty,
    );

    const initQuestion = await this.updateSessionQuestion(
      matchId,
      topic,
      difficulty,
    );
    this.logger.log(`Trying to create redis record for session: ${matchId}`);

    return initQuestion;
  }

  async updateMessage(matchId: string, messageData: any): Promise<void> {
    await this.collabRedisService.updateMessage(matchId, messageData);
  }

  // async handleDisconnect(matchId: string, webSocketId: string): Promise<void> {
  //   await this.collabRedisService.removeWebSocketId(matchId, webSocketId);
  // }
}
