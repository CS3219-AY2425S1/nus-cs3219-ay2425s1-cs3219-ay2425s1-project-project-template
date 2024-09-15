import express, { json } from 'express';
import pino from 'pino-http';

const app = express();
app.use(pino());
app.use(json());

app.get('/', async (req, res) => {
  res.json({
    message: 'OK',
  });
});

export default app;
