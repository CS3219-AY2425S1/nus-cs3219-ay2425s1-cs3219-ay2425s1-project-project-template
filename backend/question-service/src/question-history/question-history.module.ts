import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionSubmission, QuestionHistorySchema } from './schemas/question-history.schema';
import { QuestionHistoryService } from './question-history.service';
import { QuestionHistoryController } from './question-history.controller';
import { QuestionHistoryDB } from './question-history.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QuestionSubmission.name, schema: QuestionHistorySchema }
    ]),
  ],
  controllers: [QuestionHistoryController],
  providers: [QuestionHistoryService, QuestionHistoryDB],
})
export class QuestionHistoryModule {}