import express, { json } from 'express';
import pino from 'pino-http';
import { db, tableName } from './lib/db';

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

export default app;
