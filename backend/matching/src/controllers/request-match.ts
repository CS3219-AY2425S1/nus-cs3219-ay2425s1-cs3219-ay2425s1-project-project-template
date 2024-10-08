import { client } from '@/lib/db';
import { queueingService } from '@/services/queue';
import { IRedisClient, IRequestMatchPayload } from '@/types';
import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

let redisClient: IRedisClient;
const requestMatchController = async (req: Request, res: Response) => {
  const payload: Partial<IRequestMatchPayload> = req.body;
  const { userId, difficulty, topic } = payload;
  if (!userId || (!difficulty && !topic)) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json('Malformed Request');
  }

  if (!redisClient) {
    redisClient = await client.connect();
  }
  // Assign
  await queueingService(redisClient, { userId, difficulty, topic, socketPort: '' });
};
