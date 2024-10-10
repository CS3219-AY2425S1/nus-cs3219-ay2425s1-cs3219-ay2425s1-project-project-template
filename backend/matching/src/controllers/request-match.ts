import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { client } from '@/lib/db';
import type { IRedisClient, IRequestMatchPayload } from '@/types';
import { queueingService } from '@/services';

let redisClient: IRedisClient;
export const requestMatchController = async (req: Request, res: Response) => {
  const payload: Partial<IRequestMatchPayload> = req.body;
  const { userId, difficulty, topic } = payload;
  if (!userId || (!difficulty && !topic)) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json('Malformed Request');
  }

  if (!redisClient || !redisClient.isOpen || !redisClient.isReady) {
    redisClient = await client.connect();
  }
  // Assign
  const socketRoom = userId;

  await queueingService(redisClient, { userId, difficulty, topic, socketPort: socketRoom });

  // TODO: Test if room logic works and notif socket can connect
  return res.status(StatusCodes.OK).json({
    socketPort: socketRoom,
  });
};
