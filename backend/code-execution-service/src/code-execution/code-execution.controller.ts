import { Controller, Post, Body } from '@nestjs/common';
import { CodeExecutionService } from './code-execution.service';

@Controller('api/code-execution')
export class CodeExecutionController {
  constructor(private readonly codeExecutionService: CodeExecutionService) {}

  @Post()
  async executeCode(
    @Body() 
    body: {
      questionId: string;
      language: string;
      code: string;
    }
  ) {
    const { questionId, language, code } = body;
    return await this.codeExecutionService.executeCode(
      questionId,
      language,
      code
    );
  }
}