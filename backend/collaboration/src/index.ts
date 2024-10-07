import { EXPRESS_PORT } from '@/config';
import { logger } from '@/lib/utils';
import app from '@/server';
import MatchingService from './services/MatchingService';
import MatchingWorker from './services/MatchingWorker';

const port = Number.parseInt(EXPRESS_PORT || '8001');

const listenMessage = `App listening on port: ${port}`;
app.listen(port, () => {
  logger.info(listenMessage);
});


const main = async () => {
    const service = new MatchingService();
  await service.connect();

  const worker = new MatchingWorker();
  await worker.connect();

  // Start the worker
  worker.pollAndMatch().catch(console.error);

  // Example user request
  const channelName = await service.requestMatch('user123', 'typescript', 'Medium');
  console.log(`User subscribed to channel: ${channelName}`);

  const matchResult = await service.subscribeToMatch(channelName);
  if (matchResult) {
    console.log(`Match found: ${matchResult}`);
  } else {
    console.log("No match found within the timeout period");
  }
};
