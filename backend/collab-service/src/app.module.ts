import { Module } from '@nestjs/common';
import { CollabController } from './collab.controller';
import { CollabService } from './services/collab.service';
import { CollabGateway } from './collab.gateway';

@Module({
  imports: [],
  controllers: [CollabController],
  providers: [CollabGateway, CollabService]
})
export class AppModule {}
