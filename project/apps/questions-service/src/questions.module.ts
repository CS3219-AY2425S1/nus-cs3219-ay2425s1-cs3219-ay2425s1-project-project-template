import { Module } from '@nestjs/common';
import { QuestionsController } from './adapters/controllers/questions.controller';
import { QuestionsService } from './services/questions.service';
import { ConfigModule } from '@nestjs/config';
import { QuestionsRepositoryImpl } from './adapters/db/questions.supabase';
import { QuestionsRepository } from './domain/ports/questions.respository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [QuestionsController],
  providers: [
    QuestionsService,
    {
      provide: QuestionsRepository,
      useClass: QuestionsRepositoryImpl,
    },
  ],
})
export class QuestionsModule {}
