import { createClient } from 'redis';

import { MatchRequest, Difficulty } from '@/types';

class MatchingService {
  private redisClient: ReturnType<typeof createClient>;

  constructor() {
    this.redisClient = createClient();
  }

  async connect(): Promise<void> {
    await this.redisClient.connect();
  }

  async requestMatch(userId: string, topic: string, difficulty: Difficulty): Promise<string> {
    const channelName = `match:${userId}`;
    const request: MatchRequest = { userId, topic, difficulty, timestamp: Date.now() };

    // Add request to the pool
    await this.redisClient.zAdd(`pool:${topic}`, {
      score: request.timestamp,
      value: JSON.stringify(request)
    });

    return channelName;
  }

  async subscribeToMatch(channelName: string): Promise<string | null> {
    return new Promise((resolve) => {
      const subscriber = this.redisClient.duplicate();
      
      subscriber.connect().then(() => {
        subscriber.subscribe(channelName, (message) => {
          console.log(`Received: ${message}`);
          subscriber.unsubscribe(channelName);
          subscriber.quit();
          resolve(message);
        });
      });

      // Set a timeout for the subscription
      setTimeout(async () => {
        subscriber.unsubscribe(channelName);
        subscriber.quit();
        // Remove the request from the pool on timeout
        const userId = channelName.split(':')[1];
        await this.removeFromPool(userId);
        resolve(null);
      }, 60000); // 60 seconds timeout
    });
  }

  private async removeFromPool(userId: string): Promise<void> {
    const topics = await this.redisClient.keys('pool:*');
    for (const topic of topics) {
      const members = await this.redisClient.zRange(topic, 0, -1);
      for (const member of members) {
        const request: MatchRequest = JSON.parse(member);
        if (request.userId === userId) {
          await this.redisClient.zRem(topic, member);
          break;
        }
      }
    }
  }
}

export default MatchingService