import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Types } from 'mongoose';

@Injectable()
export class CodeExecutionService {
  constructor(
    @InjectQueue('code-execution') private codeExecutionQueue: Queue
  ) {}

  async executeCode(questionId: string, language: string, code: string) {
    try {
      const MY_OBJECT_ID = new Types.ObjectId('6727bbec45ec125ef2e6e27c');
      const job = await this.codeExecutionQueue.add('execute', {
        MY_OBJECT_ID,
        language,
        code,
      }, {
        attempts: 3, 
        backoff: {
          type: 'exponential',
          delay: 1000, 
        },
        removeOnComplete: true, 
        removeOnFail: false, 
      });

      const result = await job.finished();
      return result;

    } catch (error) {
      console.error("Code execution error:", error);
      throw new HttpException(
        error.message || 'Code execution failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}