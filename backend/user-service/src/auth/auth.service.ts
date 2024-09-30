import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private oAuth2Client: OAuth2Client;
  private clientID: string;
  private clientSecret: string;

  constructor(private configService: ConfigService, private jwtService: JwtService) {
    this.clientID = configService.get<string>('GOOGLE_CLIENT_ID');
    this.clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');
    this.oAuth2Client = new OAuth2Client(this.clientID, this.clientSecret, 'http://localhost:3000');
  }
  async verifyJWTToken(jwtToken: string) {
    const loginTicket = await this.oAuth2Client.verifyIdToken({
      idToken: jwtToken,
      audience: this.clientID
    })
    const payload = loginTicket.getPayload();

    const tokenData = { sub: payload['sub'], email: payload['email'], name: payload['name'], picture: payload['picture'] }
    const accessToken = await this.jwtService.signAsync(tokenData, { expiresIn: "2h" });
    // console.log("THIS IS THE TOKEN ", accessToken);
    return {jwtToken: accessToken};
  }

}
