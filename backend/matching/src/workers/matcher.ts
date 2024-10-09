import { client } from '@/lib/db';
import { POOL_INDEX, STREAM_GROUP, STREAM_NAME, STREAM_WORKER } from '@/lib/db/constants';
import { decodePoolTicket, getPoolKey } from '@/lib/utils';
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
      logger.info(`Received request: ${JSON.stringify(matchRequest)}`);
      // Query the pool
      const {
        id: requestorStreamId,
        userId: requestorUserId,
        socketPort: requestorSocketPort,
        difficulty,
        topic,
      } = decodePoolTicket(matchRequest);
      const clause = [`-@userId:(${requestorUserId})`];
      if (difficulty) {
        clause.push(`@difficulty:{${difficulty}}`);
      }
      if (topic) {
        clause.push(`@topic:{${topic}}`);
      }
      const matches = await redisClient.ft.search(POOL_INDEX, clause.join(' '), {
        LIMIT: { from: 0, size: 1 },
        SORTBY: { BY: 'timestamp', DIRECTION: 'ASC' },
      });

      // IF Found:
      if (matches.total > 0) {
        const matched = matches.documents[0];
        const {
          userId: matchedUserId,
          timestamp: matchedStreamId, // We use timestamp as the Stream ID
          socketPort: matchedSocketPort,
        } = decodePoolTicket(matched);

        logger.info(`Found match: ${JSON.stringify(matched)}`);

        await Promise.all([
          // Remove other from pool
          redisClient.del([getPoolKey(requestorUserId), getPoolKey(matchedUserId)]),
          // Remove other from queue
          redisClient.xDel(STREAM_NAME, [requestorStreamId, matchedStreamId]),
        ]);

        // Notify both sockets
        io.sockets.in([requestorSocketPort, matchedSocketPort]).emit(' ROOMNUMBER | QUESTION??? ');
      } else {
        logger.info(`Found no matches`);
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
