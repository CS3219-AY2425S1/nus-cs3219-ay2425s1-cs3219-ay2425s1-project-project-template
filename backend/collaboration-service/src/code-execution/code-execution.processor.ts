import { Process, Processor } from '@nestjs/bull';
import { Logger, HttpException, HttpStatus } from '@nestjs/common';
import { Job } from 'bull';
import axios from 'axios';
import { Types } from 'mongoose';

@Processor('code-execution')
export class CodeExecutionProcessor {
  private readonly logger = new Logger(CodeExecutionProcessor.name);
  private readonly PISTON_API_URL = 'https://emkc.org/api/v2/piston';
  private readonly QUESTION_SERVICE_URL = 'http://localhost:8000/questions';

  private readonly EXECUTION_TIMEOUT = 10000; // 10 seconds
  private readonly MEMORY_LIMIT = 256 * 1024 * 1024; // 256MB in bytes
  private readonly MAX_OUTPUT_LENGTH = 1024 * 1024; // 1MB in bytes

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
          try {
            const response = await axios.post(
              `${this.PISTON_API_URL}/execute`, 
              {
                language,
                version: this.getLanguageVersion(language),
                files: [
                  {
                    name: 'source.code',
                    content: code,
                  },
                ],
                stdin: testCase.input,
                // Piston specific runtime limits
                runTimeout: 5000, // 5 seconds max runtime
                compileTimeout: 10000, // 10 seconds max compile time
                memoryLimit: this.MEMORY_LIMIT,
              },
              {
                timeout: this.EXECUTION_TIMEOUT, // Axios request timeout
              }
            );

            const executionResult = {
              output: response.data.run.output,
              stderr: response.data.run.stderr,
              stdout: response.data.run.stdout,
              exitCode: response.data.run.code,
              compile: response.data.compile,
            };

            if (executionResult.stdout.length > this.MAX_OUTPUT_LENGTH) {
              throw new Error('Output size limit exceeded');
            }

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
              executionTime: response.data.run.time, // Execution time in ms
              memoryUsage: response.data.run.memory, // Memory usage in bytes
            };

          } catch (error) {
            if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
              return {
                testCaseNumber: index + 1,
                input: testCase.input,
                expectedOutput: testCase.expectedOutput,
                actualOutput: '',
                passed: false,
                error: 'Code execution timed out',
                executionTime: this.EXECUTION_TIMEOUT,
                memoryUsage: null,
              };
            }

            if (error.response?.data?.message?.includes('memory limit exceeded')) {
              return {
                testCaseNumber: index + 1,
                input: testCase.input,
                expectedOutput: testCase.expectedOutput,
                actualOutput: '',
                passed: false,
                error: 'Memory limit exceeded',
                executionTime: null,
                memoryUsage: this.MEMORY_LIMIT,
              };
            }

            return {
              testCaseNumber: index + 1,
              input: testCase.input,
              expectedOutput: testCase.expectedOutput,
              actualOutput: '',
              passed: false,
              error: error.message || 'Execution failed',
              executionTime: null,
              memoryUsage: null,
            };
          }
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