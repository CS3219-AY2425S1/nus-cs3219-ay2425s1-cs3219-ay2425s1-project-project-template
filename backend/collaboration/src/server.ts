import cors from 'cors';
import express, { json } from 'express';
import { StatusCodes } from 'http-status-codes';
import pino from 'pino-http';
import { UI_HOST } from './config';
import roomRoutes from './routes/room';

const app = express();
app.use(pino());
app.use(json());
app.use(
  cors({
    origin: [UI_HOST],
    credentials: true,
  })
);
app.use('/room', roomRoutes);
// Health Check for Docker
app.get('/health', (_req, res) => res.status(StatusCodes.OK).send('OK'));

export default app;
