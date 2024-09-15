import { Controller, All, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { GatewayService } from '../services/gateway.service';

@Controller('api')
export class GatewayController {
  private readonly questionServiceUrl: string;
  private readonly userServiceUrl: string;
  constructor(
    private readonly gatewayService: GatewayService,
    private configService: ConfigService
  ){
    this.questionServiceUrl = this.configService.get<string>('QUESTION_SERVICE_URL');
    this.userServiceUrl = this.configService.get<string>('USER_SERVICE_URL');
  }

  @All('/')
  helloGateway(@Req() req: Request, @Res() res: Response) {
    res.status(200).json({ message: "Hello!" })
  }

  // Need auth in the future
  @All('question/*')
  async handleQuestionRequest(@Req() req: Request, @Res() res: Response): Promise<void> {
    this.gatewayService.handleRedirectRequest(req, res, this.questionServiceUrl)
  }

  // Might need to break down to handle diff requests
  @All('user/*')
  async handleUserRequest(@Req() req: Request, @Res() res: Response): Promise<void> {
    this.gatewayService.handleRedirectRequest(req, res, this.userServiceUrl)
  }
}
