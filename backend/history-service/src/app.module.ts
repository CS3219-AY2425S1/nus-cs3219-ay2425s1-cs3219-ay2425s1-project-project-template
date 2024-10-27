import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import {
  QuestionHistory,
  QuestionHistorySchema,
} from './schemas/history.schema';

import { QuestionHistoryController } from './controllers/history.controller';

import { QuestionHistoryService } from './services/history.services';

const pass = 'ikSQsrctXLavjahv';
const user = 'history-service';
const dbName = 'history-service';

const connection_string = `mongodb+srv://${user}:${pass}@cluster0.izvdz.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;

@Module({
  imports: [
    MongooseModule.forRoot(connection_string),
    MongooseModule.forFeature([
      {
        name: QuestionHistory.name,
        schema: QuestionHistorySchema,
      },
    ]),
  ],
  controllers: [AppController, QuestionHistoryController],
  providers: [AppService, QuestionHistoryService],
})
export class AppModule {}
