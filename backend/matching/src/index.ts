import { EXPRESS_PORT } from '@/config';
import { logger } from '@/lib/utils';
import server from '@/server';
import path from 'path';
import { ChildProcess, fork } from 'child_process';

const workers: ChildProcess[] = [];

const port = Number.parseInt(EXPRESS_PORT || '8001');

const listenMessage = `App listening on port: ${port}`;
server.listen(port, () => {
  logger.info(listenMessage);

  const matcher = fork(path.join(__dirname, 'workers', 'matcher.js'));
  const cleaner = fork(path.join(__dirname, 'workers', 'cleaner.js'));
  workers.push(matcher);
  workers.push(cleaner);
  matcher.on('message', (message) => {
    logger.info(`[Worker]: ${message}`);
  });
  cleaner.on('message', (message) => {
    logger.info(`[Cleaner]: ${message}`);
  });
  matcher.on('exit', (code) => {
    logger.error(`Matcher exited with code ${code}.`);
  });
  cleaner.on('exit', (code) => {
    logger.error(`Cleaner exited with code ${code}.`);
  });
});

const shutdown = async () => {
  await Promise.all(workers.map((worker) => worker.kill('SIGTERM')));
  server.close(() => {
    logger.info('App shut down');
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
