import async from 'async';
import { client } from '@/lib/db';
import { POOL_INDEX, STREAM_GROUP, STREAM_NAME, STREAM_WORKER } from '@/lib/db/constants';
import { io } from '@/server';

const logger = {
  info: (message: unknown) => process.send && process.send(message),
  error: (message: unknown) => process.send && process.send(message),
};

process.on('SIGTERM', () => {
  client
    .disconnect()
    .then(() => client.quit())
    .then(process.exit(0));
});

async function match() {
  try {
    const redisClient = client.isReady || client.isOpen ? client : await client.connect();
    // eslint-disable-next-line no-constant-condition
    while (true) {
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
          BLOCK: 2000,
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
      } else {
        await new Promise((resolve, reject) =>
          setTimeout(() => {
            resolve({});
          }, 1000)
        );
      }
    }
  } catch (error) {
    const { message, cause, name } = error as unknown as Error;
    logger.error('::match: ' + JSON.stringify({ message, cause, name }));
    process.exit(1);
  }
}

async.forever(
  (next) => {
    void match();
    next();
  },
  (err) => {
    logger.error(err);
    process.exit(1);
  }
);
