import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Y from 'yjs';
import { Room, RoomResponse } from '../interfaces/room.interface';

@Injectable()
export class CollabService {
  private rooms: Map<string, Room> = new Map(); // roomId -> Room
  private userRooms: Map<string, string> = new Map(); // userId -> roomId

  constructor(private configService: ConfigService) {}

  createRoom(roomId: string): RoomResponse | null {
    if (this.rooms.has(roomId)) {
      return null;
    }

    const room: Room = {
      id: roomId,
      users: new Set(),
      doc: new Y.Doc()
    };

    this.rooms.set(roomId, room);
    return {
        id: room.id,
        users: Array.from(room.users),
        doc: room.doc.guid
    };
  }

  joinRoom(roomId: string, userId: string): RoomResponse | null {
    const room = this.rooms.get(roomId);
    
    if (!room || room.users.size >= 2) {
      return null;
    }

    room.users.add(userId);
    this.rooms.set(roomId, room);
    this.userRooms.set(userId, roomId);
    return {
        id: room.id,
        users: Array.from(room.users),
        doc: room.doc.guid
    };
  }

  leaveRoom(userId: string): RoomResponse | null {
    const roomId = this.userRooms.get(userId);
    if (!roomId) return null;

    const room = this.rooms.get(roomId);
    if (!room) return null;

    room.users.delete(userId);
    this.rooms.set(roomId, room);
    this.userRooms.delete(userId);

    // Clean up empty rooms
    if (room.users.size === 0) {
      this.rooms.delete(roomId);
    }

    return {
        id: room.id,
        users: Array.from(room.users),
        doc: room.doc.guid
    };
  }

  getAllRooms(): RoomResponse[] {
    return Array.from(this.rooms.values()).map(room => ({
        id: room.id,
        users: Array.from(room.users),
        doc: room.doc.guid
    }));
  }

  getAvailableRooms() {
    return Array.from(this.rooms.values())
      .filter(room => room.users.size < 2)
      .map(room => ({
        id: room.id,
        users: Array.from(room.users),
        doc: room.doc.guid
      }));
  }

  getRoom(roomId: string): RoomResponse | null {
    const room = this.rooms.get(roomId);
    console.log("room:", room);
    return room ? 
        {
            id: room.id,
            users: Array.from(room.users),
            doc: room.doc.guid
        } : null;
  }

  getRoomByClient(userId: string): RoomResponse | null {
    const roomId = this.userRooms.get(userId);
    if (roomId) {
        const room = this.rooms.get(roomId);
        return {
            id: room.id,
            users: Array.from(room.users),
            doc: room.doc.guid
        };
    }
    return null;
  }

}
