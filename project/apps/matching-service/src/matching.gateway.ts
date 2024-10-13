import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

@WebSocketGateway(8080, {
  cors: {
    origin: '*', // Adjust for security in production
  },
})
export class MatchingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): void {
    console.log(`Received message from client ${client.id}: ${data}`);
    client.emit('message', `Server received: ${data}`);
  }
}
