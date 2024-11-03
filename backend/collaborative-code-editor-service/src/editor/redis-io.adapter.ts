import { IoAdapter } from '@nestjs/platform-socket.io';
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { ConfigService } from '@nestjs/config';
import { ServerOptions } from 'socket.io';
import { Logger } from '@nestjs/common';

export class RedisIoAdapter extends IoAdapter {
  private readonly logger = new Logger(RedisIoAdapter.name);
  private adapterConstructor: ReturnType<typeof createAdapter>;

  async connectToRedis(): Promise<void> {
    const configService = new ConfigService();
    
    // Create Redis pub client
    const pubClient = createClient({
      url: configService.get('REDIS_URL'),
      password: configService.get('REDIS_PASSWORD'),
    });

    // Create Redis sub client (a duplicate of pub client)
    const subClient = pubClient.duplicate();

    // Handle connection events
    pubClient.on('error', (error) => {
      this.logger.error('Redis Pub Client Error:', error);
    });

    subClient.on('error', (error) => {
      this.logger.error('Redis Sub Client Error:', error);
    });

    // Connect both clients
    await Promise.all([
      pubClient.connect(),
      subClient.connect(),
    ]);

    // Create the adapter
    this.adapterConstructor = createAdapter(pubClient, subClient, {
      // Optional configuration
      key: 'socket.io', // Redis key prefix
      publishOnSpecificResponseChannel: true, // Enables direct messaging
      requestsTimeout: 5000, // Timeout for requests between nodes
    });

    this.logger.log('Redis adapter initialized successfully');
  }

  createIOServer(port: number, options?: ServerOptions) {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}