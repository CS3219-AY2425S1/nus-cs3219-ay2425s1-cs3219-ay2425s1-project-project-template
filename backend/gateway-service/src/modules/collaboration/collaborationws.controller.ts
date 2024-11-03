import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JoinCollabSessionRequestDto } from './dto/join-collab-session-request.dto';
import {
  CHAT_SEND_MESSAGE,
  SESSION_JOIN,
  SESSION_LEAVE,
} from './collaboration.message';
import {
  CHAT_RECIEVE_MESSAGE,
  EXCEPTION,
  SESSION_ERROR,
  SESSION_JOINED,
  SESSION_LEFT,
} from './collaborationws.event';
import { LeaveCollabSessionRequestDto } from './dto/leave-collab-session-request.dto';
import { ChatSendMessageRequestDto } from './dto/chat-send-message-request.dto';

@WebSocketGateway({
  namespace: '/collaboration',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Accept'],
    credentials: true,
  },
})
export class CollaborationGateway implements OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private socketUserMap = new Map<string, string>(); // socketId -> userId

  @SubscribeMessage(SESSION_JOIN)
  async handleSessionJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinCollabSessionRequestDto,
  ) {
    const { userId, sessionId } = payload;

    if (!userId || !sessionId) {
      client.emit(SESSION_ERROR, 'Invalid join session request payload.');
      return;
    }

    try {
      // TODO: validate session whether its active / user is allowed to be in it

      this.socketUserMap.set(client.id, userId);
      client.join(sessionId);

      this.debugFunction(`user joined`);

      this.server.to(sessionId).emit(SESSION_JOINED, {
        userId,
        sessionId,
        message: 'A user joined the session',
      });
    } catch (error) {
      client.emit(EXCEPTION, `Error joining session: ${error.message}`);
      return;
    }
  }

  @SubscribeMessage(SESSION_LEAVE)
  async handleSessionLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: LeaveCollabSessionRequestDto,
  ) {
    console.log("session_leave received");
    const { userId, sessionId } = payload;

    if (!userId || !sessionId) {
      client.emit(SESSION_ERROR, 'Invalid leave session request payload.');
      return;
    }

    try {
      client.leave(sessionId);

      this.server.to(sessionId).emit(SESSION_LEFT, {
        userId,
        sessionId,
        message: 'A user left the session.',
      });
    } catch (error) {
      client.emit(EXCEPTION, `Error leaving session: ${error.message}`);
      return;
    }
  }

  @SubscribeMessage(CHAT_SEND_MESSAGE)
  async handleChatSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: ChatSendMessageRequestDto,
  ) {
    const { userId, sessionId, message } = payload;

    if (!userId || !sessionId || !message) {
      client.emit(SESSION_ERROR, 'Invalid send message request payload.');
      return;
    }

    try {
      // TODO: add chat content inside redis memory

      this.server.to(sessionId).emit(CHAT_RECIEVE_MESSAGE, {
        userId,
        sessionId,
        message,
      });
    } catch (error) {
      client.emit(EXCEPTION, `Error sending chat message: ${error.message}`);
      return;
    }
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    // When client disconnects from the socket
    console.log(`User: ${this.socketUserMap.get(client.id)} disconnected`);
    this.debugFunction(`disconnect`);
    this.socketUserMap.delete(client.id);
  }

  debugFunction(eventName: string) {
    try {
      console.log(`${eventName} occured`);
      console.log(`Socket User Map:`);
      for (const [key, value] of this.socketUserMap) {
        console.log(`${key} -> ${value}`);
      }

      console.log(`Adapters:`);
      console.log(this.server.adapter['rooms']);
      console.log(this.server.adapter['sids']);
      // this.server
      //   .in(`1`)
      //   .fetchSockets()
      //   .then((v) => console.log(`room members: ${v.toString}`));
    } catch (e) {
      console.log(`ERROR!!!! ${e}`);
    }
  }
}
