import { EXPRESS_PORT } from '@/config';
import { logger } from '@/lib/utils';
import server from '@/server';
import { dbHealthCheck } from '@/server';

const port = Number.parseInt(EXPRESS_PORT ?? '8001');

const listenMessage = `App listening on port: ${port}`;
server.listen(port, () => {
  void dbHealthCheck();
  logger.info(listenMessage);
});
