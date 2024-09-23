import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import * as bcrypt from 'bcryptjs';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  private oauthClient: OAuth2Client;

  constructor(
    private readonly jwtService: JwtService,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) {
    this.oauthClient = new OAuth2Client({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: process.env.GOOGLE_CALLBACK_URL,
    });
  }

  getHello(): string {
    return 'This is the auth service!';
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = await bcrypt.genSalt(); // Number of salt rounds for bcrypt
    return bcrypt.hash(password, saltRounds);
  }

  async generateJwt(user: any) {
    const payload = { email: user.email, sub: user._id };
    return this.jwtService.sign(payload);
  }

  async registerUser(email: string, password: string): Promise<any> {
    try {
      const hashedPassword = await this.hashPassword(password);
      const user = await lastValueFrom(
        this.userClient.send(
          { cmd: 'create_user' },
          { email, password: hashedPassword },
        ),
      );

      const token = this.generateJwt(user);

      return {
        message: 'User registered successfully',
        user,
        token,
      };
    } catch (error) {
      throw new RpcException(error.message || 'Internal server error');
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await lastValueFrom(
        this.userClient.send({ cmd: 'get_user_by_email' }, { email }),
      );

      if (!user) {
        throw new RpcException('User not found');
      }

      const isPsValid = await bcrypt.compare(password, user.password);

      if (!isPsValid) {
        throw new RpcException('Invalid credentials');
      }

      const { password: _, ...result } = user;
      return result;
    } catch (error) {
      throw new RpcException(error.message || 'Internal server error');
    }
  }

  // Exchange the authorization code for tokens and user profile
  async exchangeGoogleCodeForTokens(code: string): Promise<any> {
    try {
      const { tokens } = await this.oauthClient.getToken(code);
      this.oauthClient.setCredentials(tokens);

      // Verify the id token
      const ticket = await this.oauthClient.verifyIdToken({
        idToken: tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      // Retrieve user profile
      const userInfo = await this.oauthClient.request({
        url: 'https://www.googleapis.com/oauth2/v3/userinfo',
      });

      return {
        tokens,
        user: {
          email: payload.email,
          name: payload.name,
          picture: payload.picture,
          ...(typeof userInfo.data === 'object' ? userInfo.data : {}),
        },
      };
    } catch (error) {
      console.error('Error during token exchange:', error);
      throw new Error('Error exchanging authorization code for tokens');
    }
  }
}
