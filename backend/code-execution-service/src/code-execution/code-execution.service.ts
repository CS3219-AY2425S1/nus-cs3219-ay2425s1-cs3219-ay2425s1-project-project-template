import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class CodeExecutionService {
  constructor(
    @InjectQueue('code-execution') private codeExecutionQueue: Queue
  ) {}

  async executeCode(sessionId: string, questionId: string, language: string, code: string) {
    try {
      const [waiting, active, delayed, failed] = await Promise.all([
        this.codeExecutionQueue.getWaiting(),
        this.codeExecutionQueue.getActive(),
        this.codeExecutionQueue.getDelayed(),
        this.codeExecutionQueue.getFailed()
      ]);

      const allJobs = [...waiting, ...active, ...delayed, ...failed];

      const existingJob = allJobs.find(job => {
        const data = job.data;
        return data.sessionId === sessionId && data.questionId === questionId;
      });

      if (existingJob) {
        if (failed.includes(existingJob)) {
          await existingJob.remove();
        } else {
          throw new HttpException(
            'A code execution job for this session and question is already in progress',
            HttpStatus.CONFLICT
          );
        }
      }

      const job = await this.codeExecutionQueue.add('execute', {
        sessionId,
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
        removeOnFail: true,  
        jobId: `${sessionId}-${questionId}`,  
      });

      const result = await job.finished();
      
      try {
        await job.remove();
      } catch (removeError) {
        // Ignore remove errors as the job might already be removed
      }

      return result;
      
    } catch (error) {
      console.error("Code execution error:", error);
      throw new HttpException(
        error.message || 'Code execution failed',
        error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
