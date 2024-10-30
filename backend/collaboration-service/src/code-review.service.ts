import { Inject, Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { config } from './configs';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CodeReviewService {
  private openaiClient: OpenAI;

  constructor(
    @Inject('QUESTION_SERVICE') private readonly questionClient: ClientProxy,
  ) {
    this.openaiClient = new OpenAI({
      apiKey: config.openai.apiKey,
    });
  }

  private async getQuestionDetails(questionId: string) {
    return firstValueFrom(
      this.questionClient.send(
        { cmd: 'get-question-by-id' },
        { id: questionId },
      ),
    );
  }

  async reviewCode(questionId: string, code: string): Promise<string> {
    const question = await this.getQuestionDetails(questionId);
    if (!question) {
      throw new RpcException('Unable to retrieve code review');
    }
    const params: OpenAI.Chat.ChatCompletionCreateParams = {
      messages: [
        {
          role: 'system',
          content: `You are an expert AI code reviewer. Your task is to analyze and provide specific, actionable feedback on the following code. Identify any potential issues, explain errors clearly, suggest improvements, and highlight best practices. Focus on readability, performance, maintainability, and adherence to coding standards.`,
        },
        {
          role: 'system',
          content: `The question or task description is: "${question.text}". Take this into account while reviewing the code.`,
        },
        {
          role: 'user',
          content: `Here is the code for review:\n${code}`,
        },
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
      max_tokens: 500,
    };
    const response = await this.openaiClient.chat.completions.create(params);

    console.log(response);

    return response.choices[0].message.content;
  }
}
