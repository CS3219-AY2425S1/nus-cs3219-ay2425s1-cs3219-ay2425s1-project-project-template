import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';
import { CollabModule } from './collaboration/collaboration.module';
import { CodeExecutionModule } from './code-execution/code-execution.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RedisModule,
    CollabModule,
    CodeExecutionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
