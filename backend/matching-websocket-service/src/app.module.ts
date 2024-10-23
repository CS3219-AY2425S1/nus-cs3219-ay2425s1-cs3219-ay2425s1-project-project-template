import { Module } from '@nestjs/common';
import { MatchingWebSocketController } from './app.controller';
import { MatchingWebSocketService } from './app.service';
import { MatchingWebSocketGateway } from './matching.gateway';

@Module({
  imports: [],
  controllers: [MatchingWebSocketController],
  providers: [MatchingWebSocketService, MatchingWebSocketGateway],
})
export class AppModule {}
