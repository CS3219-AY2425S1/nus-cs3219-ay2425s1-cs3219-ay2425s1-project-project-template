import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CodeReviewDto, CreateSessionDto } from './dto';
import { CodeReviewService } from './code-review.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly codeReviewService: CodeReviewService) {}

  @MessagePattern({ cmd: 'get-session-details-by-id' })
  async handleGetSessionDetails(@Payload() data: { id: string }) {
    const sessionDetails = await this.appService.getSessionDetails(data.id);
    return sessionDetails;
  }

  @MessagePattern({ cmd: 'create-session' })
  async handleCreateSession(@Payload() data: CreateSessionDto) {
    const sessionDetails = await this.appService.createSession(data);
    return sessionDetails;
  }

  @MessagePattern({ cmd: 'review-code' })
  async handleReviewCode(@Payload() data: CodeReviewDto) {
    const { questionId, code } = data;
    const review = await this.codeReviewService.reviewCode(questionId, code);
    return review;
  }
}
