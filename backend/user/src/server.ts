import express, { json } from 'express';
import pino from 'pino-http';
import { db } from './lib/db';
import authRoutes from './routes/auth';
import helmet from 'helmet';
import { sql } from 'drizzle-orm';
import { logger } from './lib/utils';
import { exit } from 'process';

const app = express();
app.use(pino());
app.use(json());
app.use(helmet());
app.use('/auth', authRoutes);
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
    exit(1);
  }
};

// Ensure DB service is up before running.
app.get('/test-db', async (_req, res) => {
  await dbHealthCheck();
  res.json({ message: 'OK ' });
});

export default app;
