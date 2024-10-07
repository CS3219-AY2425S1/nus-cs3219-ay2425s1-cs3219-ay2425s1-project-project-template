import { createClient } from 'redis';

import { MatchRequest} from '@/types';

class MatchingWorker {
  private redisClient: ReturnType<typeof createClient>;

  constructor() {
    this.redisClient = createClient();
  }

  async connect(): Promise<void> {
    await this.redisClient.connect();
  }

  async pollAndMatch(): Promise<void> {
    while (true) {
      const topics = await this.redisClient.keys('pool:*');
      for (const topic of topics) {
        const requests = await this.redisClient.zRange(topic, 0, -1, { REV: true });
        for (let i = 0; i < requests.length; i++) {
          const request1: MatchRequest = JSON.parse(requests[i]);
          for (let j = i + 1; j < requests.length; j++) {
            const request2: MatchRequest = JSON.parse(requests[j]);
            if (this.isMatch(request1, request2)) {
              await this.matchUsers(request1, request2);
              break;
            }
          }
        }
      }
      // Wait for a short time before polling again
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  private isMatch(request1: MatchRequest, request2: MatchRequest): boolean {
    return request1.topic === request2.topic && 
           (request1.difficulty === request2.difficulty || 
            request1.topic !== request2.topic);
  }

  private async matchUsers(request1: MatchRequest, request2: MatchRequest): Promise<void> {
    // Remove both requests from the pool
    await this.redisClient.zRem(`pool:${request1.topic}`, JSON.stringify(request1));
    await this.redisClient.zRem(`pool:${request2.topic}`, JSON.stringify(request2));

    // Notify both users
    const matchInfo = JSON.stringify({
      partner: request2.userId,
      topic: request1.topic,
      difficulty: request1.difficulty
    });
    await this.redisClient.publish(`match:${request1.userId}`, matchInfo);

    const matchInfo2 = JSON.stringify({
      partner: request1.userId,
      topic: request2.topic,
      difficulty: request2.difficulty
    });
    await this.redisClient.publish(`match:${request2.userId}`, matchInfo2);

    console.log(`Matched: ${request1.userId} and ${request2.userId}`);
  }
}

export default MatchingWorker;