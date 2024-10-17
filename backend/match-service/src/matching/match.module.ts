import { Module } from '@nestjs/common';
import { RabbitMQModule } from '../../../shared/rabbitmq/rabbitmq.module';
import { MatchWebSocket } from '../matching-websocket/match.websocket.gateway';
import { MatchService } from './match.service';

@Module({
  imports: [RabbitMQModule.forRoot({ url: 'amqp://localhost:5672' })],
  providers: [MatchWebSocket, MatchService],
})
export class MatchModule {}
