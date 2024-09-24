import { Inject, Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  getHello(): string {
    return 'This is the auth service!';
  }

  async localSignUp(email: string, password: string) {
    try {
      return firstValueFrom(
        this.authClient.send({ cmd: 'local-sign-up' }, { email, password }),
      );
    } catch (error) {
      if (error instanceof RpcException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  async localLogIn(email: string, password: string) {
    try {
      return firstValueFrom(
        this.authClient.send({ cmd: 'local-log-in' }, { email, password }),
      );
    } catch (error) {
      if (error instanceof RpcException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
    }
  }

  async getGoogleAuthRedirect(code: string) {
    return firstValueFrom(
      this.authClient.send({ cmd: 'google-auth-redirect' }, { code }),
    );
  }

  getGoogleOAuthUrl(): string {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = process.env.GOOGLE_CALLBACK_URL;
    const scope = 'email profile';
    const responseType = 'code';
    const state = 'secureRandomState';

    const googleOAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;

    return googleOAuthUrl;
  }
}
