import { exit } from 'process';

import cors from 'cors';
import express, { json } from 'express';
import pino from 'pino-http';
import { sql } from 'drizzle-orm';
import helmet from 'helmet';

import questionsRouter from '@/routes/question';
import { config, db } from '@/lib/db';
import { logger } from '@/lib/utils';

const app = express();
app.use(pino());
app.use(json());
app.use(helmet());
app.use(
  cors({
    origin: [process.env.PEERPREP_UI_HOST!],
    credentials: true,
  })
);

app.use('/questions', questionsRouter);
app.get('/', async (_req, res) => {
  res.json({
    message: 'OK',
  });
});

export const dbHealthCheck = async () => {
  try {
    await db.execute(sql`SELECT 1`);
    logger.info('Connected to DB');
  } catch (error) {
    const { message } = error as Error;
    logger.error('Cannot connect to DB: ' + message);
    logger.error(`DB Config: ${JSON.stringify({ ...config, password: '<REDACTED>' })}`);
    exit(1);
  }
};

// Ensure DB service is up before running.
app.get('/test-db', async (_req, res) => {
  await dbHealthCheck();
  res.json({ message: 'OK ' });
});

export default app;
