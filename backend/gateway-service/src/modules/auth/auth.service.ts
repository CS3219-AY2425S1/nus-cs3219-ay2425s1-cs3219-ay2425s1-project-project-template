import {
  Inject,
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import {
  LogInDto,
  LogInResponseDto,
  SignUpDto,
  SignUpResponseDto,
  ValidateUserCredDto,
} from './dto';
import { GetUserByEmailDto } from '../user/dto/get-user-by-email.dto';

import { IServiceCreateUserResponse } from '../interfaces/user/service-user-create-response.interface';
import { IServiceCreateTokenResponse } from '../interfaces/auth/service-create-token-response.interface';
import { IServiceGetUserResponse } from '../interfaces/user/service-user-get-response.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {}

  async signUp(data: SignUpDto): Promise<SignUpResponseDto> {
    const createUserResponse: IServiceCreateUserResponse = await firstValueFrom(
      this.userClient.send({ cmd: 'create-user' }, data),
    );

    if (createUserResponse.status !== HttpStatus.CREATED) {
      throw new HttpException(
        {
          message: createUserResponse.message,
          data: null,
          errors: createUserResponse.errors,
        },
        createUserResponse.status,
      );
    }

    const createTokenResponse: IServiceCreateTokenResponse =
      await firstValueFrom(
        this.authClient.send(
          { cmd: 'generate-jwt' },
          {
            id: createUserResponse.user.id,
            email: createUserResponse.user.email,
          },
        ),
      );

    return {
      message: createUserResponse.message,
      data: {
        token: createTokenResponse.token,
        user: createUserResponse.user,
      },
      errors: null,
    };
  }

  async logIn(data: LogInDto): Promise<LogInResponseDto> {
    const getUserResponse: IServiceGetUserResponse = await firstValueFrom(
      this.userClient.send({ cmd: 'validate-user' }, data),
    );

    if (getUserResponse.status !== HttpStatus.OK) {
      throw new UnauthorizedException({
        message: getUserResponse.message,
        data: null,
        errors: null,
      });
    }

    const createTokenResponse: IServiceCreateTokenResponse =
      await firstValueFrom(
        this.authClient.send(
          { cmd: 'generate-jwt' },
          {
            id: getUserResponse.user.id,
            email: getUserResponse.user.email,
          },
        ),
      );

    return {
      message: getUserResponse.message,
      data: {
        token: createTokenResponse.token,
        user: getUserResponse.user,
      },
      errors: null,
    };
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
