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

async function clean() {
  const redisClient = client.isReady || client.isOpen ? client : await client.connect();
  const response = await redisClient.xAutoClaim(
    STREAM_NAME,
    STREAM_GROUP,
    STREAM_CLEANER,
    30000,
    '0-0'
  );

  if (!response || response.messages.length === 0) {
    await new Promise((resolve, _reject) => {
      setTimeout(() => resolve('Next Loop'), 5000);
    });
    return;
  }
  // ACK, Delete
  for (const message of response.messages) {
    if (!message) {
      continue;
    }
    const payload = message.message;
    logger.info(`Expiring ${JSON.stringify(payload)}`);

    const POOL_KEY = `${MATCH_PREFIX}${payload.userId}`;
    await Promise.all([
      // Delete from pool
      redisClient.del(POOL_KEY),
      // ACK
      redisClient.xDel(STREAM_NAME, message.id),
    ]);

    if (payload.socketPort) {
      // Notify client
      const socketRoom = payload.socketPort;
      io.sockets.in(socketRoom).emit('FAILED');
      io.sockets.in(socketRoom).disconnectSockets();
    }
  }
}

(function loop() {
  Promise.resolve()
    .then(async () => await clean())
    .catch((err) => {
      if (err !== null) {
        const { message, name, cause } = err as Error;
        logger.error(JSON.stringify({ message, name, cause }));
      }
    })
    .then(() => process.nextTick(loop));
})();
