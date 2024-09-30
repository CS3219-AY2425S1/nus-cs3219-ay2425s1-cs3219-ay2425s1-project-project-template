import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionsModule } from './questions/questions.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1/PeerPrep'),
    QuestionsModule,
  ],
})
export class AppModule {}
