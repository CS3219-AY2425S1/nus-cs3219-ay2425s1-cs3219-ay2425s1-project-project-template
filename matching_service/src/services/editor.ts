// types/editor.ts
export interface EditorState {
  content: { [username: string]: string };
  language: string;
  activeUsers: string[];
}

// Add these to your existing ServerSocketEvents

interface UserSocketData {
  username: string;
  roomId: string;
}

// services/editorManager.ts
export class EditorManager {
  // Map: roomId -> EditorState
  private roomEditorStates = new Map<string, EditorState>();
  // Map: socketId -> UserSocketData (tracks which room and username each socket belongs to)
  private socketToUser = new Map<string, UserSocketData>();

  initializeRoom(roomId: string, language: string = "javascript") {
    if (!this.roomEditorStates.has(roomId)) {
      console.log("Initializing room", roomId);
      this.roomEditorStates.set(roomId, {
        content: {},
        language,
        activeUsers: [],
      });
    }
    return this.roomEditorStates.get(roomId)!;
  }

  addUserToRoom(socketId: string, username: string, roomId: string) {
    // Track which room this socket/user is in
    this.socketToUser.set(socketId, { username, roomId });

    const state = this.roomEditorStates.get(roomId);
    if (state && !state.activeUsers.includes(username)) {
      state.activeUsers.push(username);
      return true;
    }
    return false;
  }

  removeUserFromRoom(socketId: string) {
    const userData = this.socketToUser.get(socketId);
    if (!userData) return false;

    const { username, roomId } = userData;
    const state = this.roomEditorStates.get(roomId);

    if (state) {
      state.activeUsers = state.activeUsers.filter((u) => u !== username);
      // Clean up empty rooms
      if (state.activeUsers.length === 0) {
        this.roomEditorStates.delete(roomId);
      }
    }

    this.socketToUser.delete(socketId);
    return true;
  }

  updateCode(roomId: string, username: string, code: string) {
    const state = this.roomEditorStates.get(roomId);
    if (state) {
      state.content[username] = code;
      return true;
    }
    return false;
  }

  getRoomState(roomId: string) {
    return this.roomEditorStates.get(roomId);
  }

  getUserData(socketId: string) {
    return this.socketToUser.get(socketId);
  }

  // Debug method to show current state
  debugState() {
    console.log("Current Rooms:", Array.from(this.roomEditorStates.keys()));
    console.log("Connected Sockets:", Array.from(this.socketToUser.entries()));
  }
}
