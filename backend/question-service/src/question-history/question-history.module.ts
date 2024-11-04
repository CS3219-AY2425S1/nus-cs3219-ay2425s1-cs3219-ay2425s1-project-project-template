
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QuestionHistoryService } from './question-history.service';
import { QuestionHistoryController } from './question-history.controller';
import { Session, SessionSchema } from './schemas/session.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.question-history',
      isGlobal: true,
    }),
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI_SESSIONS'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [QuestionHistoryController],
  providers: [QuestionHistoryService],
})
export class QuestionHistoryModule {}


// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { QuestionSubmission, QuestionHistorySchema } from './schemas/question-history.schema';
// import { QuestionHistoryService } from './question-history.service';
// import { QuestionHistoryController } from './question-history.controller';
// import { QuestionHistoryDB } from './question-history.model';

// @Module({
//   imports: [
//     MongooseModule.forFeature([
//       { name: QuestionSubmission.name, schema: QuestionHistorySchema }
//     ]),
//   ],
//   controllers: [QuestionHistoryController],
//   providers: [QuestionHistoryService, QuestionHistoryDB],
// })
// export class QuestionHistoryModule {}
