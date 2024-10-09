import { client } from '@/lib/db';
import {
  MATCH_PREFIX,
  POOL_INDEX,
  STREAM_GROUP,
  STREAM_NAME,
  STREAM_WORKER,
} from '@/lib/db/constants';
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
  const redisClient = client.isReady || client.isOpen ? client : await client.connect();
  logger.info('Iterating');
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
  if (!stream || stream.length === 0) {
    await new Promise((resolve, _reject) => {
      setTimeout(() => resolve('Next Loop'), 5000);
    });
    return;
  }
  for (const group of stream) {
    // Perform matching
    for (const matchRequest of group.messages) {
      // Query the pool
      const matchRequestor = matchRequest.message;
      const clause = [`-@userId:(${matchRequestor.userId})`];
      if (matchRequestor.difficulty) {
        clause.push(`@difficulty:{${matchRequestor.difficulty}}`);
      }
      if (matchRequestor.topic) {
        clause.push(`@topic:{${matchRequestor.topic}}`);
      }
      const matches = await redisClient.ft.search(POOL_INDEX, clause.join(' '), {
        LIMIT: { from: 0, size: 1 },
        SORTBY: { BY: 'timestamp', DIRECTION: 'ASC' },
      });

      // IF Found:
      if (matches.total > 0) {
        const matched = matches.documents[0];
        const matchedStreamKey = matched.id;
        const matchedUser = matched.value;

        await Promise.all([
          // Remove other from pool
          redisClient.del([
            `${MATCH_PREFIX}${matchRequestor.userId}`,
            `${MATCH_PREFIX}${matchedUser.userId}`,
          ]),
          // Remove other from queue
          redisClient.xDel(STREAM_NAME, [matchRequest.id, matchedStreamKey]),
        ]);

        // Notify both sockets
        io.sockets
          .in([matchRequestor.socketPort, matchedUser.socketPort as string])
          .emit(' ROOMNUMBER | QUESTION??? ');
      }
    }
  }
}

(function loop() {
  Promise.resolve()
    .then(async () => await match())
    .catch((error) => {
      if (error !== null) {
        const { message, name, cause } = error as Error;
        logger.error(JSON.stringify({ message, name, cause }));
      }
    })
    .then(() => process.nextTick(loop));
})();
