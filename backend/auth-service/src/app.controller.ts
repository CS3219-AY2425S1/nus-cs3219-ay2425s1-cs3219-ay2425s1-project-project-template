import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IAuthGenerateJwt, IAuthJwtResponse } from './interfaces';
import { ValidateUserDto } from './dto';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern({ cmd: 'generate-jwt' })
  async generateJwt(
    @Payload() data: IAuthGenerateJwt,
  ): Promise<IAuthJwtResponse> {
    let result: IAuthJwtResponse;

    if (data) {
      try {
        const createTokenResponse = await this.appService.generateJwt(data);
        result = {
          status: HttpStatus.CREATED,
          message: 'token_create_success',
          token: createTokenResponse,
        };
      } catch (e) {
        result = {
          status: HttpStatus.BAD_REQUEST,
          message: 'token_create_bad_request',
          token: null,
        };
      }
    } else {
      result = {
        status: HttpStatus.BAD_REQUEST,
        message: 'token_create_bad_request',
        token: null,
      };
    }

    return result;
  }

  @MessagePattern({ cmd: 'validate-user' })
  async validateUser(@Payload() data: ValidateUserDto): Promise<boolean> {
    let result = false;

    if (data) {
      result = await this.appService.validateUser(data);
    }

    return result;
  }

  @MessagePattern({ cmd: 'google-auth-redirect' })
  async googleAuthRedirect(data: { code: string }) {
    const { code } = data;
    const tokens = await this.appService.exchangeGoogleCodeForTokens(code);

    const jwtToken = this.appService.generateJwt(tokens.user);
    return { token: jwtToken };
  }
}
