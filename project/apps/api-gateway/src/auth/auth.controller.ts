import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  UsePipes,
} from '@nestjs/common';

import { Response } from 'express';
import { ZodValidationPipe } from '@repo/pipes/zod-validation-pipe.pipe';
import {
  signInSchema,
  SignInDto,
  signUpSchema,
  SignUpDto,
} from '@repo/dtos/auth';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UsePipes(new ZodValidationPipe(signUpSchema))
  async signUp(@Body() body: SignUpDto, @Res() res: Response) {
    const { user, session } = await this.authService.signUp(body);
    res.cookie('token', session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 * 1000,
    });

    return res.status(HttpStatus.OK).json({ user });
  }

  @Post('signin')
  @UsePipes(new ZodValidationPipe(signInSchema))
  async signIn(@Body() body: SignInDto, @Res() res: Response) {
    const { user, session } = await this.authService.signIn(body);
    res.cookie('token', session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 * 1000,
    });

    return res.status(HttpStatus.OK).json({ user });
  }

  @Post('signout')
  async signOut(@Res() res: Response) {
    res.clearCookie('token');
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Signed out successfully' });
  }
}
