import { logger } from '@/lib/utils';
import app, { dbHealthCheck } from '@/server';

const port = process.env.PORT || 8001;

const listenMessage = `App listening on port: ${port}`;
app.listen(port, () => {
  void dbHealthCheck();
  logger.info(listenMessage);
});
