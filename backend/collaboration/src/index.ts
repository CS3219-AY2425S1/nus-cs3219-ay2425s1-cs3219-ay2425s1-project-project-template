import { EXPRESS_PORT } from '@/config';
import { logger } from '@/lib/utils/logger';
import { dbHealthCheck } from '@/server';
import server from '@/websocket';

const port = Number.parseInt(EXPRESS_PORT || '8001');
const wsPort = Number.parseInt(WEBSOCKET_PORT || '8002');

const listenMessage = `App listening on port: ${port}`;
server.listen(port, () => {
  void dbHealthCheck();
  logger.info(listenMessage);
});
server.listen(wsPort, () => logger.info(`WebSocket listening on port: ${wsPort}`));
