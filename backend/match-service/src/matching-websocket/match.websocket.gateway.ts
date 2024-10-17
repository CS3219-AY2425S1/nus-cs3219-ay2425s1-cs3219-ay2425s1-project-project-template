import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { RabbitMQService } from '../../../shared/rabbitmq/rabbitmq.service';
import { MatchRequestDTO } from '../matching/dto/match-request.dto';

@WebSocketGateway(3232, {
  cors: {
    origin: '*',
  },
})
export class MatchWebSocket {
  @WebSocketServer()
  server: Server;

  constructor(private readonly rabbitMQService: RabbitMQService) {}

  @SubscribeMessage('initMatch')
  async handleMatchRequest(@MessageBody() data: MatchRequestDTO) {
    await this.rabbitMQService.sendToQueue('match_queue', data);
  }

  sendMatchingResult(clientId: string, result: any) {
    this.server.to(clientId).emit('matchResult', result);
  }
}
