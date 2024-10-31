import { Server } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { URL } from 'url';
import { rooms } from '../server/rooms';
import logger from '../utils/logger';

import * as encoding from 'lib0/encoding';
import * as decoding from 'lib0/decoding';
import * as syncProtocol from 'y-protocols/sync';
import * as awarenessProtocol from 'y-protocols/awareness';

export const setupWebSocketServer = (server: Server): void => {
  const wss = new WebSocketServer({ server });

  // Map to store client IDs
  const wsToClientID = new Map<WebSocket, number>();

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

    const { code: doc, awareness } = room;

    // Assign a unique clientID to this WebSocket connection
    const clientID = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    wsToClientID.set(ws, clientID);

    // Function to send a message to a client
    const send = (message: Uint8Array) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      }
    };

    // Function to broadcast a message to all other clients in the room
    const broadcastMessage = (message: Uint8Array) => {
      room.connectedClients.forEach((client: WebSocket) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    };

    // Define message types
    const messageSync = 0;
    const messageAwareness = 1;

    // Send Sync Step 1 (initial document state)
    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, messageSync);
    syncProtocol.writeSyncStep1(encoder, doc);
    send(encoding.toUint8Array(encoder));

    // Handle incoming messages
    ws.on('message', (message: Buffer) => {
      const decoder = decoding.createDecoder(message);
      const messageType = decoding.readVarUint(decoder);

      switch (messageType) {
        case messageSync:
          const encoder = encoding.createEncoder();
          encoding.writeVarUint(encoder, messageSync);
          syncProtocol.readSyncMessage(decoder, encoder, doc, null); // Added 'null' as the fourth argument
          if (encoding.length(encoder) > 1) {
            send(encoding.toUint8Array(encoder));
          }
          break;
        case messageAwareness:
          const awarenessUpdate = decoding.readVarUint8Array(decoder);
          const clientID = wsToClientID.get(ws);
          if (clientID !== undefined) {
            awarenessProtocol.applyAwarenessUpdate(awareness, awarenessUpdate, clientID);
            // Broadcast the awareness update to other clients
            room.connectedClients.forEach((client: WebSocket) => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
              }
            });
          }
          break;
        default:
          logger.info('Unknown message type received');
          break;
      }
    });

    ws.on('close', () => {
      room.connectedClients.delete(ws);
      const clientID = wsToClientID.get(ws);
      if (clientID !== undefined) {
        awarenessProtocol.removeAwarenessStates(awareness, [clientID], null);
        wsToClientID.delete(ws);
      }
      if (room.connectedClients.size === 0) {
        rooms.delete(roomId);
      }
    });
  });

  logger.info('WebSocket server is set up and listening for connections.');
};
