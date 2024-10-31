import { Socket, Server } from "socket.io";

// Handle connection and store user info on the socket
export const handleConnection = (socket: Socket): void => {
  const userId = socket.handshake.auth.userId;
  const username = socket.handshake.auth.username;

  // Emit errors if user ID or username is missing
  if (!userId) {
    socket.emit("connection-error", { message: "User ID is required" });
    socket.disconnect(true);
    return;
  }
  if (!username) {
    socket.emit("connection-error", { message: "Username is required" });
    socket.disconnect(true);
    return;
  }

  // Attach user data to the socket
  socket.data.userId = userId;
  socket.data.username = username;

  // Notify the client of successful connection
  socket.emit("connection-success", { message: "Connected successfully!" });
};

// Handle joining a specific room
export const handleJoinRoom = (socket: Socket, roomId: string): void => {
  socket.join(roomId);
  console.log(`User ${socket.data.username} joined room ${roomId}`);
  socket.emit("room-joined", { roomId });
};

// Handle sending a message within a specific room
export const handleSendMessage = (
  io: Server,
  socket: Socket,
  roomId: string,
  message: string
): void => {
  // Broadcast the message to the room only
  io.to(roomId).emit("chatMessage", {
    user: socket.data.username,
    text: message,
  });
};
