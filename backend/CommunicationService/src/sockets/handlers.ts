import { Server, Socket } from "socket.io";
import {
  handleConnection,
  handleJoinRoom,
  handleSendMessage,
} from "../controllers/chatController";

export function initializeCommunicationSockets(io: Server) {
  io.on("connection", (socket: Socket) => {
    // Initial connection setup
    handleConnection(socket);

    // Listen for joining a room
    socket.on("joinRoom", (roomId: string) => {
      handleJoinRoom(socket, roomId);
    });

    // Listen for sending chat messages to a specific room
    socket.on("chatMessage", ({ roomId, text }) => {
      console.log("Received room:", roomId);
      console.log("Received message:", text);
      handleSendMessage(io, socket, roomId, text);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User ${socket.data.username} disconnected`);
    });
  });
}
