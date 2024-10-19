import { Server } from "socket.io";
import { addUserToQueue } from "./queue-controller.js";
let io;

// Set up socket.io and handle user interactions
export const initializeCollaborationService = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle user joining the queue
    socket.on("joinQueue", async (userData) => {
      socket.emit("assignSocketId", { assignedSocket: socket.id });

      // Add the user to the matching queue with socketId for later communication
      try {
        const resp = await addUserToQueue(userData, socket);
        console.log("User added to queue:", resp);
        socket.emit("queueEntered", { message: "You have joined the queue" });
      } catch (err) {
        console.error("Error adding user to queue:", err.message);
        socket.emit("joinQueueFailed", {
          error: "Failed to join the queue, please try again",
        });
      }
      // Notify the user they've joined the queue
    });

    // Handle message sending and broadcasting to other users
    // Handle sending a message to a room
    socket.on("sendMessage", (messageData) => {
      const { room, message, username } = messageData;

      if (room == "") {
        // Broadcast the message to all other connected users
        socket.broadcast.emit("receiveMessage", {
          username: messageData.username,
          message: messageData.message,
        });
      } else {
        console.log(
          `User ${username} is sending a message to room ${room}: ${message}`
        );
        // Send the message to all users in the same room
        io.to(room).emit("receiveMessage", {
          username,
          message,
        });
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

// Notify users when they have been matched
export const notifyUsersOfMatch = (user1SocketId, user2SocketId, room) => {
  // Have both users join the room
  const user1Socket = io.sockets.sockets.get(user1SocketId);
  const user2Socket = io.sockets.sockets.get(user2SocketId);

  if (user1Socket && user2Socket) {
    // Make both users join the room
    user1Socket.join(room);
    user2Socket.join(room);

    // Emit the 'matched' event to notify both users that they've been matched
    io.to(user1SocketId).emit("matched", { room });
    io.to(user2SocketId).emit("matched", { room });

    console.log(
      `Users ${user1SocketId} and ${user2SocketId} have joined room: ${room}`
    );
  } else {
    console.log(
      `Error: Could not find sockets for users: ${user1SocketId} or ${user2SocketId}`
    );
  }
};

// Notify users when the match fails or times out
export const notifyUserOfMatchFailed = (socketId, message) => {
  io.to(socketId).emit("matchFailed", { error: message });
};
