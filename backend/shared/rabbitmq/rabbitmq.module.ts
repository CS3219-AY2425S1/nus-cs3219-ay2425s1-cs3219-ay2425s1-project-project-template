import { Module, DynamicModule } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';

@Module({})
export class RabbitMQModule {
  static forRoot(config: { url: string }): DynamicModule {
    return {
      module: RabbitMQModule,
      providers: [
        {
          provide: RabbitMQService,
          useFactory: () => {
            const rabbitmqService = new RabbitMQService(config);
            rabbitmqService.connect(config.url)
            return rabbitmqService
          },
        },
      ],
      exports: [RabbitMQService],
    };
  }
}