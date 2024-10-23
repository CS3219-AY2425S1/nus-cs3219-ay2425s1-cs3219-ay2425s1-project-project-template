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
    io.on('connection', (client) => this.onConnect(client));
    io.on('disconnect', (client) => this.onDisconnect(client));
  }

  private onConnect(client: Socket) {
    const onMatchRequest = async (matchRequest: MatchRequest) => {
      await this.matchingWebSocketService.addMatchRequest(matchRequest)
      client.emit('matchRequestResponse', { message: 'Match request received' });
    }

    console.log('Client connected to Matching WebSocket');
    client.once('matchRequest', onMatchRequest);
  }

  private async onDisconnect(client: Socket) {
    console.log('Client disconnected');
    await this.matchingWebSocketService.cancelMatchRequest(client.id)
  }
}