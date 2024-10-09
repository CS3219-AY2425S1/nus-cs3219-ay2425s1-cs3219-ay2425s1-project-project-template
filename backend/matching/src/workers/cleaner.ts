import async from 'async';
import { client } from '@/lib/db';
import { MATCH_PREFIX, STREAM_CLEANER, STREAM_GROUP, STREAM_NAME } from '@/lib/db/constants';
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
          if (!message) {
            continue;
          }
          await Promise.all([
            // Delete from pool
            redisClient.del(`${MATCH_PREFIX}${message.id}`),
            // ACK
            redisClient.xAck(STREAM_NAME, STREAM_GROUP, message.id),
          ]);
          // Notify client
          io.sockets.in('').emit('FAILED');
        }
      }
    }
  } catch (error) {
    const { message, cause } = error as unknown as Error;
    logger.error('::match: ' + JSON.stringify({ message, cause }));
    process.exit(1);
  }
}

async.forever(
  (next) => {
    void match();
    next();
  },
  (err) => {
    logger.error(JSON.stringify(err));
    process.exit(1);
  }
);
