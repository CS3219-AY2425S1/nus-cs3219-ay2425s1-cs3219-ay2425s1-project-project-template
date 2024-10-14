import { Server as SocketIOServer } from 'socket.io';

declare global {
    namespace Express {
      interface Request {
        io?: SocketIOServer;
      }
    }
  }

export interface MatchRequest {
    userId: string;
    topic: string;
    difficulty: string;
}