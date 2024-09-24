import { exit } from 'process';

import cors from 'cors';
import { sql } from 'drizzle-orm';
import express, { json } from 'express';
import helmet from 'helmet';
import pino from 'pino-http';

import { dbConfig } from '@/config';
import { db } from '@/lib/db';
import { logger } from '@/lib/utils';
import authRoutes from '@/routes/auth';
import checkRoutes from '@/routes/check';

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

app.use('/auth', authRoutes);
app.use('/auth-check', checkRoutes);
app.get('/', async (_req, res) => {
  res.json({
    message: 'OK',
  });
});

export const dbHealthCheck = async (exitApp: boolean = true) => {
  try {
    await db.execute(sql`SELECT 1`);
    logger.info('Connected to DB');
  } catch (error) {
    const { message } = error as Error;
    logger.error('Cannot connect to DB: ' + message);
    logger.error(`DB Config: ${JSON.stringify(dbConfig)}`);
    if (exitApp) {
      exit(1);
    }
  }
};

// Ensure DB service is up before running.
app.get('/test-db', async (_req, res) => {
  await dbHealthCheck(false);
  res.json({ message: 'OK ' });
});

export default app;
