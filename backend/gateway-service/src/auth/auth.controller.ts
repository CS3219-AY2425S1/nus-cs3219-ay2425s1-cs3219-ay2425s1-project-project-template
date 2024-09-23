import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { RpcException } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getHello(): string {
    return this.authService.getHello();
  }

  @Get('google')
  async googleAuth(@Res() res: Response) {
    const redirectUrl = await this.authService.getGoogleOAuthUrl();
    res.redirect(redirectUrl);
  }

  @Get('google/callback')
  async googleAuthRedirect(@Query('code') code: string, @Res() res: Response) {
    const response = await this.authService.getGoogleAuthRedirect(code);

    const jwtToken = response.token;
    // Redirect the user with the JWT token (or you can set a cookie here)
    return { token: jwtToken };
  }

  @Post('login')
  async logIn(@Body() body: { email: string; password: string }) {
    try {
      const response = await this.authService.localLogIn(body.email, body.password);
      const jwtToken = response.token;
      return { token: jwtToken };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('signup')
  async signUp(@Body() body: { email: string; password: string; name: string }) {
    try {
      const response = await this.authService.localSignUp(body.email, body.password, body.name);
      return {
        message: response.message,
        token: response.token,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
