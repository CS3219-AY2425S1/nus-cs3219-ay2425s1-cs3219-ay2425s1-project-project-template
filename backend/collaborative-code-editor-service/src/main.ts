import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './editor/redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Create and configure the Redis adapter
  // const redisIoAdapter = new RedisIoAdapter(app);
  // await redisIoAdapter.connectToRedis();
  
  // // Use the Redis adapter
  // app.useWebSocketAdapter(redisIoAdapter);
  await app.listen(process.env.PORT ?? 3005);
}
bootstrap();
