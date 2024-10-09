import { MATCH_PREFIX, STREAM_NAME } from '@/lib/db/constants';
import { getRedisPayload } from '@/lib/utils';
import type { IQueueRequest, IRedisClient } from '@/types';

let queueId = 1;

export const queueingService = async (client: IRedisClient, payload: IQueueRequest) => {
  const formattedPayload = getRedisPayload(payload);
  const queueRes = await client.xAdd(STREAM_NAME, `${queueId}`, formattedPayload);
  await client.hSet(`${MATCH_PREFIX}${payload.userId}`, formattedPayload);
  queueId += 1;
};
