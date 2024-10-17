import { MatchWebSocket } from '../matching-websocket/match.websocket.gateway';
import { RabbitMQService } from '../../../shared/rabbitmq/rabbitmq.service';

export class MatchService {
  private waitingUsers: any[] = [];

  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly matchWebSocket: MatchWebSocket,
  ) {
    this.consumeMatchRequest();
  }

  async consumeMatchRequest() {
    await this.rabbitMQService.consumeFromQueue(
      'match_queue',
      async (message: any) => {
        const { clientId } = message;

        this.matchWebSocket.sendMatchingResult(clientId, 'Sent');
      },
    );
  }
}
