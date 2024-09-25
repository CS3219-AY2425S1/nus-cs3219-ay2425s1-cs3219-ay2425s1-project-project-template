import {
  Controller,
  Post,
  Body,
  Res,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Post('signup')
  async signUp(
    @Body() body: { email: string; password: string },
    @Res() res: Response,
  ) {
    const { email, password } = body;
    const { data, error } = await this.supabaseService
      .getClient()
      .auth.signUp({ email, password });

    if (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
    const { user, session } = data;
    if (user && session) {
      res.cookie('token', session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 * 1000, // 7 days
      });

      return res.status(HttpStatus.OK).json({ user });
    }
    throw new BadRequestException('Unexpected sign-up response.');
  }

  @Post('signin')
  async signIn(
    @Body() body: { email: string; password: string },
    @Res() res: Response,
  ) {
    const { email, password } = body;
    const { data, error } = await this.supabaseService
      .getClient()
      .auth.signInWithPassword({ email, password });

    if (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({ error: error.message });
    }
    const { user, session } = data;
    if (user && session) {
      res.cookie('token', session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 * 1000, // 7 days
      });

      return res.status(HttpStatus.OK).json({ user });
    }
    throw new BadRequestException('Unexpected sign-in response.');
  }

  @Post('signout')
  async signOut(@Res() res: Response) {
    res.clearCookie('token');
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Signed out successfully' });
  }
}
