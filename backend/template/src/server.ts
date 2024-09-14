import express, { json } from 'express';
import pino from 'pino-http';

const app = express();
app.use(pino());
app.use(json());

export default app;
