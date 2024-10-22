import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CollabService } from './services/collab.service';

@WebSocketGateway({ namespace: '/code', cors: true })
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

  handleConnection(client: Socket) {
    console.log('Client connected');
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected');
    
  }
}
