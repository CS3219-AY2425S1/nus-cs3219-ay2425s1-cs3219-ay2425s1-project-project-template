import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import config from './config';
import logger from './utils/logger';
import http from 'http';
import { IncomingMessage } from 'http';
import { Duplex } from 'stream';
import { wsServer } from './routes/matchingRoutes';
import { Socket } from 'net';
import WebSocket from 'ws';

const app = express();

// Middleware
app.use(cors(config.corsOptions));
app.use(express.json());

// Logging middleware
// app.use((req, res, next) => {
//   logger.info(`Incoming request: ${req.method} ${req.originalUrl}`);
//   next();
// });

// Routes
app.use('/api/v1', routes);

// Error handling
app.use(errorHandler);

// Create HTTP server
const server = http.createServer(app);

// Handle WebSocket Upgrade
server.on('upgrade', (req: IncomingMessage, socket: Duplex, head: Buffer) => {
  const { url } = req;
  if (url && url.startsWith('/api/v1/matching/ws')) {
    logger.info(`WebSocket upgrade request for: ${url}`);
    wsServer.handleUpgrade(req, socket as Socket, head, (ws: WebSocket) => {
      wsServer.emit('connection', ws, req);
    });
  } else {
    socket.destroy();
  }
});

// Start server
const startServer = () => {
  server.listen(config.port, () => {
    logger.info(`API Gateway running on port ${config.port}`);
  });
};

if (require.main === module) {
  startServer();
}

export default app;
