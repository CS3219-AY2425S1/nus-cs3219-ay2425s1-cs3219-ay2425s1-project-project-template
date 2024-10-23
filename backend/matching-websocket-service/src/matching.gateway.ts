import { Injectable } from '@nestjs/common';
import { Server } from 'http';
import { Server as WebSocketServer, Socket } from 'socket.io';
import { MatchingWebSocketService } from './app.service';
import { MatchRequest } from './dto/request.dto';

@Injectable()
export class MatchingWebSocketGateway {
  constructor(private readonly matchingWebSocketService: MatchingWebSocketService) {}

  init(server: Server) {
    const io = new WebSocketServer(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });
    io.on('connection', this.onConnect);
    io.on('disconnect', this.onDisconnect);
  }

  private onConnect(client: Socket) {
    const onMatchRequest = (matchRequest: MatchRequest) => {
      console.log('Received match request:', matchRequest);
      client.emit('matchRequestResponse', { message: 'Match request received' });
      // this.matchingWebSocketService.processMatchRequest(matchRequest
    }

    console.log('Client connected to Matching WebSocket');
    client.once('matchRequest', onMatchRequest);
  }

  private onDisconnect(client: Socket) {
    console.log('Client disconnected');
  }
}