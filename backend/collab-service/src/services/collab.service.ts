import { Injectable } from '@nestjs/common';
import * as Y from 'yjs';
import { Room } from '../interfaces/room.interface';

@Injectable()
export class CollabService {
  private rooms: Map<string, Room> = new Map(); // roomId -> Room
  private userRooms: Map<string, string> = new Map(); // userId -> roomId

  constructor() {}

  createRoom(roomId: string): Room | null {
    if (this.rooms.has(roomId)) {
      return null;
    }

    const room: Room = {
      id: roomId,
      users: new Set(),
      doc: new Y.Doc()
    };

    this.rooms.set(roomId, room);
    return room;
  }

  joinRoom(roomId: string, userId: string): Room | null {
    const room = this.rooms.get(roomId);
    
    if (!room || room.users.size >= 2) {
      return null;
    }

    room.users.add(userId);
    this.userRooms.set(userId, roomId);

    return room;
  }

  leaveRoom(userId: string): Room | null {
    const roomId = this.userRooms.get(userId);
    if (!roomId) return null;

    const room = this.rooms.get(roomId);
    if (!room) return null;

    room.users.delete(userId);
    this.userRooms.delete(userId);

    // Clean up empty rooms
    if (room.users.size === 0) {
      this.rooms.delete(roomId);
    }

    return room;
  }

  getAllRooms() {
    return Array.from(this.rooms.values());
  }

  getAvailableRooms() {
    return Array.from(this.rooms.values())
      .filter(room => room.users.size < 2)
      .map(room => ({
        id: room.id,
        participantCount: room.users.size
      }));
  }

  getRoom(roomId: string): Room | null {
    return this.rooms.get(roomId) || null;
  }

  getRoomByClient(userId: string): Room | null {
    const roomId = this.userRooms.get(userId);
    return roomId ? this.rooms.get(roomId) : null;
  }

}
