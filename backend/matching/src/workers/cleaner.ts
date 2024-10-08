import { parentPort } from 'worker_threads';

import async from 'async';

import { client } from '@/lib/db';
import { STREAM_CLEANER, STREAM_GROUP, STREAM_NAME } from '@/lib/db/constants';
import { logger } from '@/lib/utils';
import { io } from '@/server';

async.forever(
  (next) => {
    void client.connect().then(async (redisClient) => {
      logger.info('Iterating Cleaner');
      const response = await redisClient.xAutoClaim(
        STREAM_NAME,
        STREAM_GROUP,
        STREAM_CLEANER,
        30000,
        '0-0'
      );

      if (response && response.messages.length > 0) {
        // ACK, Delete
        for (const message of response.messages) {
          await Promise.all([
            // Delete from pool
            redisClient.del('ID'),
            // ACK
            redisClient.xAck(STREAM_NAME, STREAM_GROUP, 'ID'),
          ]);
          // Notify client
          io.sockets.in('').emit('FAILED');
        }
      }
    });
    next();
  },
  (err) => {
    logger.error(err);
    process.exit(1);
  }
);

parentPort?.on('close', () => {
  logger.info('Cleaner Shutting Down');
  process.exit(0);
});
