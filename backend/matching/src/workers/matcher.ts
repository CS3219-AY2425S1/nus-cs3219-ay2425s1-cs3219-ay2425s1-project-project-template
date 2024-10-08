import { parentPort } from 'worker_threads';

import async from 'async';

import { client } from '@/lib/db';
import { POOL_INDEX, STREAM_GROUP, STREAM_NAME, STREAM_WORKER } from '@/lib/db/constants';
// import { logger } from '@/lib/utils';
import { io } from '@/server';

const logger = {
  info: (message: string) => {
    console.log(message);
  },
  error: (message: any) => {
    console.error(message);
  },
};

async.forever(
  (next) => {
    void client.connect().then(async (redisClient) => {
      logger.info('Iterating Worker');
      const stream = await redisClient.xReadGroup(
        STREAM_GROUP,
        STREAM_WORKER,
        {
          key: STREAM_NAME,
          id: '>',
        },
        {
          COUNT: 1,
          BLOCK: 500,
        }
      );
      if (stream && stream.length > 0) {
        for (const group of stream) {
          // Perform matching
          for (const _message of group.messages) {
            // Query the pool
            const matches = await redisClient.ft.search(
              POOL_INDEX,
              `@topic{} @difficulty{} -@id(<userId>)`,
              { LIMIT: { from: 0, size: 1 }, SORTBY: { BY: 'timestamp', DIRECTION: 'ASC' } }
            );

            // IF Found:
            if (matches.total > 0) {
              await Promise.all([
                // Remove other from pool
                redisClient.del(['key1', 'key2']),
                // Remove other from queue
                redisClient.xAck(STREAM_NAME, STREAM_GROUP, [`id1`, `id2`]),
              ]);
              // Notify both sockets
              io.sockets.in(['userId1', 'userId2']).emit(' ROOMNUMBER | QUESTION??? ');
            }
          }
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
  logger.info('Matcher Shutting Down');
  process.exit(0);
});
