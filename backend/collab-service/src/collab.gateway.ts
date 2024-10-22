import { ConnectedSocket, WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Request } from 'express';
import { Server, WebSocket } from 'ws';
import { CollabService } from './services/collab.service';
const ywsUtils = require('y-websocket/bin/utils');
const setupWSConnection = ywsUtils.setupWSConnection;

@WebSocketGateway({ path: '/code', cors: { origin: '*' } })
export class CollabGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly collabService: CollabService
  ) {}

  // For testing standalone websocket connection
  @SubscribeMessage('health')
  healthCheck() {
    return 'Health check ok';
  }

  async handleConnection(@ConnectedSocket() client: WebSocket, request: Request) {
    const urlParams = new URLSearchParams(request.url.split('?')[1]);
    const roomId = urlParams.get('roomId');
    const userId = urlParams.get('userId');
    // If roomId or userId is not provided, disconnect the client
    if (!roomId || !userId) {
      client.close();
      return;
    }
    console.log(`Client connected with userId: ${userId} and roomId: ${roomId}`);

    // Try to join the room
    const room = this.collabService.joinRoom(roomId, userId);
    if (!room) {
      client.send(JSON.stringify({ type: 'error', message: 'Room is full or does not exist' }));
      client.close();
      return;
    }

    // Setup Yjs websocket connection
    const doc = room.doc;
    await setupWSConnection(client, doc);
  }

  handleDisconnect(client: WebSocket) {
    console.log('Client disconnected');
  }
}
