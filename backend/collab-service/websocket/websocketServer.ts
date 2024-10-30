import { Server } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { URL } from 'url';
import { rooms } from '../server/rooms';
import { Room } from '../models/types';
import logger from '../utils/logger';

export const setupWebSocketServer = (server: Server): void => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
    const url = new URL(req.url || '', `http://${req.headers.host}`);
    const roomId = url.searchParams.get('roomId');

    if (!roomId) {
      ws.close();
      return;
    }

    const room = rooms.get(roomId);

    if (!room) {
      ws.close();
      return;
    }

    room.connectedClients.add(ws);

    const yDoc = room.code;

    ws.on('message', (message: Buffer) => {
      room.connectedClients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    });

    ws.on('close', () => {
      room.connectedClients.delete(ws);
      if (room.connectedClients.size === 0) {
        rooms.delete(roomId);
      }
    });
  });

  logger.info('WebSocket server is set up and listening for connections.');
};
