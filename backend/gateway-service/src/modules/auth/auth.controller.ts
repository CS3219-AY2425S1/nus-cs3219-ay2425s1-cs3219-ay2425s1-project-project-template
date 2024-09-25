import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import {
  SignUpDto,
  SignUpResponseDto,
  LogInDto,
  LogInResponseDto,
} from './dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiCreatedResponse({ type: SignUpResponseDto })
  signUp(@Body() data: SignUpDto): Promise<SignUpResponseDto> {
    return this.authService.signUp(data);
  }

  @Post('login')
  @ApiCreatedResponse({ type: LogInResponseDto })
  logIn(@Body() data: LogInDto): Promise<LogInResponseDto> {
    return this.authService.logIn(data);
  }

  @Get('google')
  async googleAuth(@Res() res: Response) {
    const redirectUrl = this.authService.getGoogleOAuthUrl();
    console.log(redirectUrl);
    res.redirect(redirectUrl);

    // In actuality, return url back to client
    // return {url: redirectUrl}
  }

  @Get('google/callback')
  async googleAuthCallback(@Query('code') code: string) {
    const response = await this.authService.getGoogleAuthRedirect(code);

    return { token: response.token, user: response.user };
  }

  @Get('github')
  async githubLogin(@Res() res: Response) {
    const redirectUrl = this.authService.getGithubOAuthUrl();
    res.redirect(redirectUrl);
    // In actuality, return url back to client
    // return {url: redirectUrl}
  }

  @Get('github/callback')
  async githubAuthCallback(@Query('code') code: string) {
    const response = await this.authService.getGithubAuthRedirect(code);

    return {
      token: response.token,
      user: response.user,
    };
  }
}
