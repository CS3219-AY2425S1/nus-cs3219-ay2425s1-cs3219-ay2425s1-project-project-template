import { Controller, Post, Body, Sse, Param, MessageEvent } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { EnterQueueDto } from 'src/dto/EnterQueue.dto';
import { map, Observable, Subject, interval } from 'rxjs';

@Controller('rabbitmq')
export class RabbitMQController {
  constructor(private readonly rabbitMQService: RabbitMQService) { }
  private matchUsers: Record<string, Subject<any>> = {};

  @Post('enter')
  sendMessage(@Body() enterQueueDto: EnterQueueDto) {
    this.rabbitMQService.enterQueue(enterQueueDto);
    return { status: 'Enter queue successfully' };
  }

  @Post('consume')
  consumeMessages() {
    this.rabbitMQService.consumeQueue();
    return { status: 'Started consuming queue' };
  }

  @Sse(':userEmail')
  sse(@Param('userEmail') userEmail: string): Observable<any> {
    console.log("sse called by ", userEmail)
    return this.rabbitMQService.createSSEStream(userEmail);
  }
}
