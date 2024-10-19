import { Controller, Post, Body } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { EnterQueueDto } from 'src/dto/EnterQueue.dto';

@Controller('rabbitmq')
export class RabbitMQController {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

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
}
