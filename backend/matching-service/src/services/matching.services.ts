import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MatchRequestDto } from 'src/dto/request.dto';


@Injectable()
export class MatchingService {
    constructor(private configService: ConfigService) {}

    getKafkaBrokerId(): string {
      return this.configService.get<string>('config.kafkaBrokerId');
    }

    addMatchRequest(req: MatchRequestDto) {
      var kafkaQueue = `${req.difficulty}-${req.topic}`;
      console.log("Queue is: ", kafkaQueue);
      
      // Add message
    }


}
