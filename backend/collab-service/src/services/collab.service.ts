import { Injectable } from '@nestjs/common';
import * as Y from 'yjs';
import { Room } from '../interfaces/room.interface';

@Injectable()
export class CollabService {
  private rooms: Map<string, Room> = new Map(); // roomId -> Room
  private clientRooms: Map<string, string> = new Map(); // userId -> roomId

  constructor() {}

  createRoom(roomId: string): Room | null {
    if (this.rooms.has(roomId)) {
      return null;
    }

    const room: Room = {
      id: roomId,
      clients: new Set(),
      doc: new Y.Doc()
    };

    this.rooms.set(roomId, room);
    return room;
  }

  joinRoom(roomId: string, clientId: string): Room | null {
    const room = this.rooms.get(roomId);
    
    if (!room || room.clients.size >= 2) {
      return null;
    }

    room.clients.add(clientId);
    this.clientRooms.set(clientId, roomId);

    return room;
  }

  leaveRoom(clientId: string): Room | null {
    const roomId = this.clientRooms.get(clientId);
    if (!roomId) return null;

    const room = this.rooms.get(roomId);
    if (!room) return null;

    room.clients.delete(clientId);
    this.clientRooms.delete(clientId);

    // Clean up empty rooms
    if (room.clients.size === 0) {
      this.rooms.delete(roomId);
    }

    return room;
  }

  getAllRooms() {
    return Array.from(this.rooms.values());
  }

  getAvailableRooms() {
    return Array.from(this.rooms.values())
      .filter(room => room.clients.size < 2)
      .map(room => ({
        id: room.id,
        participantCount: room.clients.size
      }));
  }

  getRoom(roomId: string): Room | null {
    return this.rooms.get(roomId) || null;
  }

  getRoomByClient(clientId: string): Room | null {
    const roomId = this.clientRooms.get(clientId);
    return roomId ? this.rooms.get(roomId) : null;
  }

}
