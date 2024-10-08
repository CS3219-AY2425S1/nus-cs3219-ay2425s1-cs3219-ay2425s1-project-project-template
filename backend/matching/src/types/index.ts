import { client } from '@/lib/db';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'] as const;

export type ITopicDifficulty = (typeof DIFFICULTIES)[number];

export type IRequestMatchPayload = {
  userId: string;
  topic: string | string[];
  difficulty: string;
};

export type IQueueRequest = Partial<Pick<IRequestMatchPayload, 'topic' | 'difficulty'>> &
  Pick<IRequestMatchPayload, 'userId'> & {
    socketPort: string;
  };

export type IPoolTicket = IQueueRequest & {
  socketPort: string;
  timestamp: string;
};

export type IRedisClient = Awaited<ReturnType<(typeof client)['connect']>>;
