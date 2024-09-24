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
import { RpcException } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getHello(): string {
    return this.authService.getHello();
  }

  @Post('signup')
  async signUp(@Body() body: { email: string; password: string }) {
    const response = await this.authService.localSignUp(
      body.email,
      body.password,
    );
    return {
      message: response.message,
      token: response.token,
    };
  }

  @Post('login')
  async logIn(@Body() body: { email: string; password: string }) {
    const response = await this.authService.localLogIn(
      body.email,
      body.password,
    );
    const jwtToken = response.token;
    return { token: jwtToken };
  }

  // @Post('logout')
  // async logOut(@Body() body: { token: string }) {}

  // @Post('refresh-token')
  // async refreshToken(@Body() body: { token: string }) {}

  // @Post('password-reset')
  // async passwordReset(@Body() body: { email: string }) {}

  // @Post('change-password')
  // async changePassword(@Body() body: { email: string; password: string }) {}

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
}
