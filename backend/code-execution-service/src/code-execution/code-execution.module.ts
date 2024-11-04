import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { CodeExecutionController } from './code-execution.controller';
import { CodeExecutionService } from './code-execution.service';
import { CodeExecutionProcessor } from './code-execution.processor';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'code-execution',
    }),
  ],
  controllers: [CodeExecutionController],
  providers: [CodeExecutionService, CodeExecutionProcessor],
})
export class CodeExecutionModule {}