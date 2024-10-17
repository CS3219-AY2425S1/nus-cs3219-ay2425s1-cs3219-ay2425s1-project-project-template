import { MatchWebSocket } from '../matching-websocket/match.websocket.gateway';
import { RabbitMQService } from '../../../shared/rabbitmq/rabbitmq.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MatchService {
  private waitingUsers: any[] = [];

  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly matchWebSocket: MatchWebSocket,
  ) {
    this.waitConnection();
  }

  private async waitConnection() {
    this.consumeMatchRequest();
  }

  async consumeMatchRequest() {
    await this.rabbitMQService.consumeFromQueue(
      'match_queue',
      async (message: any) => {
        const { topic, difficulty, clientId } = message;

        this.matchWebSocket.sendMatchingResult(
          clientId,
          `topic of ${topic}, difficluty of ${difficulty}`,
        );
      },
    );
  }
}
