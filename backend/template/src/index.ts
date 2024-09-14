import app from './server';
import { logger } from './utils';

const port = process.env.PORT || 8001;

const listenMessage = `App listening on port: ${port}`;
app.listen(port, () => {
  logger.info(listenMessage);
});
