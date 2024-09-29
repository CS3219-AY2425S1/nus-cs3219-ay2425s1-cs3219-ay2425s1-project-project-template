import { logger } from '@/lib/utils';
import app, { dbHealthCheck } from '@/server';

const port = Number.parseInt(process.env.EXPRESS_PORT ?? '8001');

const listenMessage = `App listening on port: ${port}`;
app.listen(port, () => {
  void dbHealthCheck();
  logger.info(listenMessage);
});
