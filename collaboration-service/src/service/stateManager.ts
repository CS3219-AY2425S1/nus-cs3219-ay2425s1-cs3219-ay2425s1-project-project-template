import { UserInfo } from '../models/models';

export class StateManager {
  // Map to track users in each collaboration room
  private roomUsers: { [roomId: string]: Set<string> } = {};

  // Map to store socket IDs to user information
  private socketUserInfo: { [socketId: string]: UserInfo } = {};

  // Map to track all users who have ever been in each collaboration room
  private roomUserHistory: { [roomId: string]: Set<string> } = {};

  // Map to store room start times
  private roomStartTime: { [roomId: string]: number } = {};

  // Map to store room timeTaken when the first user exits
  private roomTimeTaken: { [roomId: string]: number } = {};

  public addUserToRoom(socketId: string, roomId: string, userInfo: UserInfo): void {
    this.socketUserInfo[socketId] = userInfo;

    if (!this.roomUsers[roomId]) {
      this.roomUsers[roomId] = new Set();
    }
    this.roomUsers[roomId].add(userInfo.userName);

    if (!this.roomUserHistory[roomId]) {
      this.roomUserHistory[roomId] = new Set();
    }
    this.roomUserHistory[roomId].add(userInfo.userName);

    // Set room start time if not already set
    if (!this.roomStartTime[roomId]) {
        this.roomStartTime[roomId] = Date.now();
    }
  }

  public removeUserFromRoom(socketId: string, roomId: string): UserInfo | undefined {
    const userInfo = this.socketUserInfo[socketId];
    if (!userInfo) {
      return undefined;
    }

    this.roomUsers[roomId]?.delete(userInfo.userName);
    delete this.socketUserInfo[socketId];

    // If room is empty, clean up
    if (this.roomUsers[roomId]?.size === 0) {
        delete this.roomUsers[roomId];
        delete this.roomUserHistory[roomId];
        delete this.roomStartTime[roomId];
        delete this.roomTimeTaken[roomId];
      }
  
    return userInfo;
  }

  public getUserInfo(socketId: string): UserInfo | undefined {
    return this.socketUserInfo[socketId];
  }

  public getRoomStartTime(roomId: string): number | undefined {
    return this.roomStartTime[roomId];
  }

  public setRoomTimeTaken(roomId: string, timeTaken: number): void {
    this.roomTimeTaken[roomId] = timeTaken;
  }

  public getRoomTimeTaken(roomId: string): number | undefined {
    return this.roomTimeTaken[roomId];
  }

  public getPeerUserNames(roomId: string, excludeUserName: string): string[] {
    return Array.from(this.roomUserHistory[roomId] || []).filter(
      (name) => name !== excludeUserName
    );
  }

  public getCurrentUsersInRoom(roomId: string): string[] {
    return Array.from(this.roomUsers[roomId] || []);
  }
}