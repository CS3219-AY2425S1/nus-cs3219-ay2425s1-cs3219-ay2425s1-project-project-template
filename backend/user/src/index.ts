import app, { dbHealthCheck } from '@/server';
import { logger } from '@/lib/utils';

const port = Number.parseInt(process.env.EXPRESS_PORT ?? '8001');

const listenMessage = `App listening on port: ${port}`;
app.listen(port, async () => {
  await dbHealthCheck();
  logger.info(listenMessage);
});
