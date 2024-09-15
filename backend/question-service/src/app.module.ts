import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestionController } from './controllers/question.controller';
import { QuestionService } from './services/question.service';

import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true
    }),
    MongooseModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        return {
          uri: configService.mongodb.uri,
          dbName: configService.mongodb.dbName
        }
      },
    })
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class AppModule {}
