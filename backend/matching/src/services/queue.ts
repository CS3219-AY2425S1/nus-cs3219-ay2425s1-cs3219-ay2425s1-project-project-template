import { STREAM_NAME } from '@/lib/db/constants';
import { getRedisPayload } from '@/lib/utils';
import type { IQueueRequest, IRedisClient } from '@/types';

export const queueingService = async (client: IRedisClient, payload: IQueueRequest) => {
  const formattedPayload = getRedisPayload(payload);
  const queueRes = await client.xAdd(
    STREAM_NAME,
    formattedPayload.userId,
    getRedisPayload(payload)
  );
};
