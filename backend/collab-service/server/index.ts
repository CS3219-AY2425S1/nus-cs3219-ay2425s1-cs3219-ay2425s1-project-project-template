import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import logger from '../utils/logger';

import createRoomRouter from '../create-room/createRoomRouter';
import { setupCodeCollabWebSocketServer } from '../websocket/websocketServer';
import { verifyRoom } from '../verify-room-validity/verifyRoomValidityController';

dotenv.config({ path: './.env' });

const app = express();
app.use(cors());
app.use(express.json());

app.use(createRoomRouter);
app.use(verifyRoom);

const PORT = process.env.PORT || 5003;
const server = createServer(app);

setupCodeCollabWebSocketServer();

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

