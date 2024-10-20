import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import config from './config';
import logger from './utils/logger';

const app = express();

// Middleware
app.use(cors(config.corsOptions));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

// Start server
const startServer = () => {
  app.listen(config.port, () => {
    logger.info(`API Gateway running on port ${config.port}`);
  });
};

if (require.main === module) {
  startServer();
}

export default app;
