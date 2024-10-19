import { client } from '@/lib/db';
import { MATCHING_EVENT } from '@/ws/events';

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'] as const;

export type ITopicDifficulty = (typeof DIFFICULTIES)[number];

export type IRequestMatchRESTPayload = {
  userId: string;
};

export type IRequestMatchWSPayload = {
  topic: string | string[];
  difficulty: string;
};

export type IRequestMatchEvent = IRequestMatchWSPayload &
  IRequestMatchRESTPayload & {
    roomId: string;
  };

export type IQueueRequest = Partial<IRequestMatchWSPayload> &
  IRequestMatchRESTPayload & {
    socketPort: string;
    timestamp: string;
  };

export type IPoolTicket = IQueueRequest;

export type IRedisClient = Awaited<ReturnType<(typeof client)['connect']>>;

export type IStreamMessage = {
  id: string;
  message?: {
    // Stream
    [x: string]: string;
  };
  value?: Awaited<ReturnType<(typeof client)['ft']['search']>>['documents'][number]['value'];
};

export type IMatchEvent = (typeof MATCHING_EVENT)[keyof typeof MATCHING_EVENT];
export type IChildProcessMessage = {
  rooms: Array<string>;
  event: IMatchEvent;
  message?: unknown;
};
