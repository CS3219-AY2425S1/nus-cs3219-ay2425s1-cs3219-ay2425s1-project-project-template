import { Controller, Get, UnauthorizedException } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, RpcException } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern({ cmd: 'google-auth-redirect' })
  async googleAuthRedirect(data: { code: string }) {
    const { code } = data;
    const tokens = await this.appService.exchangeGoogleCodeForTokens(code);

    const jwtToken = this.appService.generateJwt(tokens.user);

    return { token: jwtToken };
  }

  @MessagePattern({ cmd: 'local-log-in' })
  async localLogIn(data: { email: string; password: string }) {
    try {
      const { email, password } = data;
      const user = await this.appService.validateUser(email, password);

      const jwtToken = this.appService.generateJwt(user);
      return { token: jwtToken };
    } catch (error) {
      throw new RpcException(error.message || 'Internal server error');
    }
  }

  @MessagePattern({ cmd: 'local-sign-up' })
  async localSignUp(data: { email: string; password: string; name: string }) {
    try {
      const { email, password, name } = data;
      const response = await this.appService.signUp(email, password, name);

      return {
        message: response.message,
        token: response.token,
      };
    } catch (error) {
      throw new RpcException(error.message || 'Internal server error');
    }
  }
}
