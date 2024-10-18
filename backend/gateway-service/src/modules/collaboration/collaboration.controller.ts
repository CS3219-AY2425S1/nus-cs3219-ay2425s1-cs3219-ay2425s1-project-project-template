import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { RedisCollaborationService } from './redis.service';
import {
  EXCEPTION,
  CONNECTED,
  JOINED_ROOM,
  LEFT_ROOM,
  CODE_CHANGED,
} from './collaboration.event';
import { JOIN_ROOM, LEAVE_ROOM, CODE_CHANGE } from './collaboration.message';
import { CodeChangeEvent } from './interfaces';

@WebSocketGateway({
  namespace: '/collaboration',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Accept'],
    credentials: true,
  },
})
export class CollaborationGateway implements OnGatewayInit {
  @WebSocketServer() server: Server;
  private userSockets: Map<string, string> = new Map();

  constructor(
    @Inject('COLLABORATION_SERVICE') private collaborationClient: ClientProxy,
    @Inject('USER_SERVICE') private userClient: ClientProxy,
    private redisService: RedisCollaborationService,
  ) {}

  afterInit() {
    // Subscribe to Redis Pub/Sub for collaboration notifications
    this.redisService.subscribeToCollaborationEvents((matchedUsers) => {
      {
      }
    });
  }

  @SubscribeMessage(LEAVE_ROOM)
  async handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; userId: string },
  ) {
    client.leave(data.roomId);
    this.collaborationClient.emit('removeUserFromRoom', data);
    client.emit(LEFT_ROOM, data.roomId);
  }

  @SubscribeMessage(CODE_CHANGE)
  handleCodeChange(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; userId: string; code: string },
  ): void {
    this.collaborationClient.emit('codeChange', data);
    client.emit(CODE_CHANGED, data.code);
  }

  @SubscribeMessage('getCodeChangesForRoom')
  async handleGetCodeChangesForRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ): Promise<CodeChangeEvent[]> {
    const codeChanges = await firstValueFrom(
      this.collaborationClient.send('getCodeChangesForRoom', data),
    );
    client.emit('codeChangesForRoom', codeChanges);
    return codeChanges;
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    const userId = client.handshake.query.userId as string;
    const roomId = client.handshake.query.roomId as string;

    if (!userId) {
      this.emitExceptionAndDisconnect(client, 'Invalid userId.');
      return;
    }

    if (!roomId) {
      this.emitExceptionAndDisconnect(client, 'Invalid roomId.');
      return;
    }

    try {
      const existingSocketId = this.userSockets.get(userId);
      if (existingSocketId && existingSocketId !== client.id) {
        this.emitExceptionAndDisconnect(
          client,
          `User ${userId} is already connected with socket ID ${existingSocketId}`,
        );
        return;
      }

      const existingUser = await firstValueFrom(
        this.userClient.send({ cmd: 'get-user-by-id' }, userId),
      );

      if (!existingUser) {
        this.emitExceptionAndDisconnect(client, `User ${userId} not found.`);
        return;
      }

      this.userSockets.set(userId, client.id);

      client.join(roomId);
      this.collaborationClient.emit('addUserToRoom', { roomId, userId });

      client.emit(JOINED_ROOM, {
        message: `User ${userId} connected with socket ID ${client.id} and joined room ${roomId}`,
      });

      console.log(
        `User ${userId} connected and joined room ${roomId} with socket ID ${client.id}`,
      );
    } catch (error) {
      this.emitExceptionAndDisconnect(client, error.message);
      return;
    }
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const userId = [...this.userSockets.entries()].find(
      ([, socketId]) => socketId === client.id,
    )?.[0];

    if (!userId) {
      this.emitExceptionAndDisconnect(
        client,
        'User not found in userSockets at disconnect.',
      );
      return;
    }
    try {
      const roomId = client.handshake.query.roomId as string;
      
      if (roomId) {
        // Remove user from Redis room pool (or your real-time tracking system)
        this.collaborationClient.emit('removeUserFromRoom', { roomId, userId });

        // Optionally notify other users in the room that the user has disconnected
        this.server.to(roomId).emit('userLeft', { roomId, userId });
      }
      // Remove user from userSockets
      this.userSockets.delete(userId);
      console.log(`User ${userId} disconnected and removed from userSockets.`);
    } catch (error) {
      client.emit(
        EXCEPTION,
        `Error disconnecting user ${userId}: ${error.message}`,
      );
    }
  }

  private emitExceptionAndDisconnect(client: Socket, message: string) {
    client.emit(EXCEPTION, `Error: ${message}`);
    client.disconnect();
  }
}
