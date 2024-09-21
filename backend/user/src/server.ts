import express, { json } from 'express';
import pino from 'pino-http';
import { db, users } from './lib/db';
import authRoutes from './routes/auth';

const app = express();
app.use(pino());
app.use(json());
app.use('/auth', authRoutes);
app.get('/', async (_req, res) => {
  res.json({
    message: 'OK',
  });
});

// Ensure DB service is up before running.
app.get('/test-db', async (_req, res) => {
  await db.select().from(users);
  res.json({ message: 'OK ' });
});

export default app;
