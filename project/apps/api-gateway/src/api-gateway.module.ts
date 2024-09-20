import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { QuestionsController } from './questions/questions.controller';

@Module({
  imports: [
    // Client for Questions Service
    ClientsModule.register([
      {
        name: 'QUESTIONS_SERVICE',
        transport: Transport.TCP,
        options: {
          port: 3001,
        },
      },
    ]),
  ],
  controllers: [QuestionsController],
})
export class ApiGatewayModule {}
