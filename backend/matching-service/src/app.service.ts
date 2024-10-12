import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}
  
  getKafkaBrokerId(): string {
    return this.configService.get<string>('config.kafkaBrokerId');
  }
}
