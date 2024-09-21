import app, { dbHealthCheck } from './server';
import { logger } from './lib/utils';

const port = process.env.PORT || 8001;

const listenMessage = `App listening on port: ${port}`;
app.listen(port, async () => {
  await dbHealthCheck();
  logger.info(listenMessage);
});
