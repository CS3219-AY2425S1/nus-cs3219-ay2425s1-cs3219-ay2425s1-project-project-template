import { Request, Response } from 'express';

import { client as redisClient } from '../lib/db';

export const cancelMatchRequestController = async (req: Request, res: Response) => {
  const { userId } = req.body; // Only check for userId

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' }); // No need for roomId
  }

  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    // Check pending status using only userId
    const exists = await redisClient.exists(`match:${userId}`);

    if (exists) {
      console.log(`Redis key for user ${userId} exists.`);
    } else {
      console.error(`Redis key for user ${userId} does NOT exist!`);
    }

    const pendingStatus = await redisClient.hGet(`match:${userId}`, 'pending');
    console.log(pendingStatus);
    const data = await redisClient.hGetAll(`match:${userId}`);
    console.log(`Data stored in Redis for user ${userId}:`, data);

    if (pendingStatus === 'true') {
      // Allow cancellation and remove from queue based on userId
      await redisClient.del(`match:${userId}`);
      console.log(`User ${userId} has canceled their match.`);
      return res.status(200).json({ message: 'Match canceled successfully' });
    } else {
      // If the match is no longer pending, deny cancellation
      console.log(`User ${userId} is no longer pending and cannot cancel.`);
      return res
        .status(403)
        .json({ message: 'Match cancellation failed: Request is not pending.' });
    }
  } catch (error) {
    console.error('Error canceling match:', error);
    return res.status(500).json({ message: 'Server error, please try again later' });
  }
};
