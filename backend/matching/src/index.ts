import { Worker } from 'worker_threads';

import { EXPRESS_PORT } from '@/config';
import { logger } from '@/lib/utils';
import server from '@/server';

const workers: Worker[] = [];

const port = Number.parseInt(EXPRESS_PORT || '8001');

const listenMessage = `App listening on port: ${port}`;
server.listen(port, () => {
  logger.info(listenMessage);
  workers.push(new Worker('./src/workers/matcher.js'));
  workers.push(new Worker('./src/workers/cleaner.js'));
});

const shutdown = async () => {
  await Promise.all(workers.map((worker) => worker.terminate()));
  server.close(() => {
    logger.info('App shut down');
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
