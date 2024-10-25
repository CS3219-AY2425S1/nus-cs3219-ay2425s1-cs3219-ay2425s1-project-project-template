import { config, exit } from 'process';

import { sql } from 'drizzle-orm';
import express, { json } from 'express';
import pino from 'pino-http';

import { db, tableName } from './lib/db';
import { logger } from './lib/utils/logger';

const app = express();
app.use(pino());
app.use(json());

app.get('/', async (_req, res) => {
  res.json({
    message: 'OK',
  });
});

// Ensure DB service is up before running.
app.get('/test-db', async (_req, res) => {
  await db.select().from(tableName);
  res.json({ message: 'OK ' });
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

export default app;
