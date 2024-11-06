import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

export class RedisService {
  private redisClient: Redis;

  constructor() {
    this.redisClient = new Redis(REDIS_URL);
  }

  async getCode(roomId: string): Promise<string> {
    return (await this.redisClient.get(`collab:${roomId}:code`)) || '';
  }

  async setCode(roomId: string, code: string): Promise<void> {
    await this.redisClient.set(`collab:${roomId}:code`, code, 'EX', 3600);
  }

  async getOutput(roomId: string): Promise<string | null> {
    return await this.redisClient.get(`collab:${roomId}:output`);
  }

  async setOutput(roomId: string, output: string): Promise<void> {
    await this.redisClient.set(`collab:${roomId}:output`, output, 'EX', 3600);
  }

  async getLanguage(roomId: string): Promise<string | null> {
    return await this.redisClient.get(`collab:${roomId}:language`);
  }

  async setLanguage(roomId: string, language: string): Promise<void> {
    await this.redisClient.set(`collab:${roomId}:language`, language, 'EX', 3600);
  }

  async pushChatMessage(roomId: string, message: string): Promise<void> {
    await this.redisClient.rpush(`chat:${roomId}`, message);
  }
}