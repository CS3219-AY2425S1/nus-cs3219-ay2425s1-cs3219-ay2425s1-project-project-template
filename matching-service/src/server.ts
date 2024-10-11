// src/index.ts

import express from 'express';
import matchRoutes from './routes/match-routes';
import { consumeMatchRequests } from './service/match-service';
import { connectRabbitMQ } from './queue/rabbitmq';

const app = express();
app.use(express.json());

app.use('/api', matchRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  try {
    await connectRabbitMQ();
    consumeMatchRequests();
    console.log(`Matching service is running on port ${PORT}`);
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
    process.exit(1);
  }
});
