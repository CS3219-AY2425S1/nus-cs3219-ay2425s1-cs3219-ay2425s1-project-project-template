import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import axios from 'axios';
import { Types } from 'mongoose';

@Processor('code-execution')
export class CodeExecutionProcessor {
  private readonly logger = new Logger(CodeExecutionProcessor.name);
  private readonly PISTON_API_URL = 'https://emkc.org/api/v2/piston';
  private readonly QUESTION_SERVICE_URL = 'http://localhost:8000/questions';

  @Process('execute')
  async handleCodeExecution(job: Job) {
    this.logger.debug(`Processing job ${job.id}`);
    const { questionId, language, code } = job.data;

    try {
      const MY_OBJECT_ID = new Types.ObjectId('6727deaa8af46c7a5736b499');
      const response = await axios.get(`${this.QUESTION_SERVICE_URL}/${MY_OBJECT_ID}`);
      const question = response.data;

      if (!question) {
        throw new Error('Question not found');
      }

      const testCases = question.testCases?.length > 0
        ? question.testCases
        : [{ input: '', expectedOutput: '', description: 'Default test case' }];

      const testResults = await Promise.all(
        testCases.map(async (testCase, index) => {
          const response = await axios.post(`${this.PISTON_API_URL}/execute`, {
            language,
            version: this.getLanguageVersion(language),
            files: [
              {
                name: 'source.code',
                content: code,
              },
            ],
            stdin: testCase.input,
          });

          const executionResult = {
            output: response.data.run.output,
            stderr: response.data.run.stderr,
            stdout: response.data.run.stdout,
            exitCode: response.data.run.code,
            compile: response.data.compile,
          };

          const passed = this.compareOutput(
            executionResult.stdout,
            testCase.expectedOutput
          );

          return {
            testCaseNumber: index + 1,
            input: testCase.input,
            expectedOutput: testCase.expectedOutput,
            actualOutput: executionResult.stdout,
            passed,
            error: executionResult.stderr,
            compilationError: executionResult.compile?.stderr || null,
          };
        })
      );

      return {
        totalTests: testResults.length,
        passedTests: testResults.filter(test => test.passed).length,
        failedTests: testResults.filter(test => !test.passed).length,
        testResults,
      };

    } catch (error) {
      this.logger.error(`Error processing job ${job.id}:`, error);
      throw error;
    }
  }

  private getLanguageVersion(language: string): string {
    const languageVersions = {
      python: '3.10',
      javascript: '18.15.0',
      typescript: '5.0.3',
      java: '19.0.2',
      cpp: '10.2.0',
    };

    return languageVersions[language] || 'latest';
  }

  private compareOutput(actual: string, expected: string): boolean {
    const normalizeOutput = (output: string) =>
      output.trim().toLowerCase().replace(/\s+/g, ' ');
    
    return normalizeOutput(actual) === normalizeOutput(expected);
  }
}