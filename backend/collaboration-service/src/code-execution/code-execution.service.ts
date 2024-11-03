import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class CodeExecutionService {
  constructor(
    @InjectQueue('code-execution') private codeExecutionQueue: Queue
  ) {}

  async executeCode(questionId: string, language: string, code: string) {
    try {
      const job = await this.codeExecutionQueue.add('execute', {
        questionId,
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