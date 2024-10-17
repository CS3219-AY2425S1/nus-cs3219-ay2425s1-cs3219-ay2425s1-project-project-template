import { Server } from 'socket.io';
import { matchingQueue } from '../queue/matching-queue.js';

let io;

// Set up socket.io and handle user interactions
export const initializeCollaborationService = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Handle user joining the queue
    socket.on('joinQueue', (userData) => {
      console.log(`${userData.username} joined the queue for topic: ${userData.topic}`);
      
      // Add the user to the matching queue with socketId for later communication
      matchingQueue.add({
        username: userData.username,
        topic: userData.topic,
        difficulty: userData.difficulty,
        questionId: userData.questionId,
        socketId: socket.id
      });

      // Notify the user they've joined the queue
      socket.emit('queueEntered', { message: "You have joined the queue" });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

// Notify users when they have been matched
export const notifyUsersOfMatch = (user1SocketId, user2SocketId, room) => {
  io.to(user1SocketId).emit('matched', { room });
  io.to(user2SocketId).emit('matched', { room });
};

// Notify users when the match fails or times out
export const notifyUserOfMatchFailed = (socketId, message) => {
  io.to(socketId).emit('matchFailed', { error: message });
};