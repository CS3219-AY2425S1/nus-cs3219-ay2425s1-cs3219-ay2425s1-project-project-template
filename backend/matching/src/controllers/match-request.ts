import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { client, logQueueStatus } from '@/lib/db';
import type { IRedisClient, IRequestMatchPayload } from '@/types';
import { createNotifSocket, queueingService } from '@/services';
import { logger } from '@/lib/utils';

let redisClient: IRedisClient;
export const matchRequestController = async (req: Request, res: Response) => {
  const payload: Partial<IRequestMatchPayload> = req.body;
  const { userId, difficulty, topic } = payload;
  if (!userId || (!difficulty && !topic)) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json('Malformed Request');
  }

  if (!redisClient || !redisClient.isOpen || !redisClient.isReady) {
    redisClient = await client.connect();
  }

  // TODO: Assign a proper socket to the user
  const socketRoom = createNotifSocket(userId);
  const timestamp = `${Date.now()}`;

  // Send socket to user first for them to subscribe
  res
    .status(StatusCodes.OK)
    .json({
      socketPort: socketRoom,
      requestId: timestamp, // Queue ID
    })
    .end();

  // TODO: Wait for user to connect to notif socket, or add a time buffer

  await queueingService(redisClient, {
    userId,
    difficulty,
    topic,
    socketPort: socketRoom,
    timestamp,
  });

  logQueueStatus(logger, redisClient, `Queue Status Before Matching: <PLACEHOLDER>`);
};

export const cancelMatchController = async (req: Request, res: Response) => {
  const { requestId, userId } = req.body;

  if (!requestId && !userId) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json('Malformed Request');
  }

  if (!redisClient || !redisClient.isOpen || !redisClient.isReady) {
    redisClient = await client.connect();
  }

  try {
    // Remove the user from the match queue
    const queueKey = `matchQueue:${requestId || userId}`;
    const result = await redisClient.del(queueKey);

    if (result > 0) {
      logger.info(`Cancelled match request with requestId: ${requestId} or userId: ${userId}`);
      res.status(StatusCodes.OK).json({ message: 'Match request cancelled successfully.' });
    } else {
      logger.warn(`No match request found for requestId: ${requestId} or userId: ${userId}`);
      res.status(StatusCodes.NOT_FOUND).json({ error: 'No active match request found to cancel.' });
    }
  } catch (error) {
    logger.error('Error cancelling match request:', error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: 'Failed to cancel match request.' });
  }
};
