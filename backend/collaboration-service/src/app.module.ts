import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisService } from './redis.service';
import { RoomWorkerService } from './room-worker.service';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from './configs';
import { CollabSessionSchema } from './schema/collab-session.schema';

@Module({
  imports: [
    MongooseModule.forRoot(config.mongo.connectionString),
    MongooseModule.forFeature([
      {
        name: 'CollabSession',
        schema: CollabSessionSchema,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, RedisService, RoomWorkerService],
})
export class AppModule {}
