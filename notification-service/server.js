// notificationService.js
const amqp = require('amqplib');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const PORT = 4002;

const server = http.createServer(app);
const io = new Server(server);

// Store connected clients
let connectedClients = {};  // Mapping of userId to socketId

let connection;
let channel;

async function initRabbitMQ() {
  connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();

  // Declare the queue
  await channel.assertQueue('match_found_queue');

  // Listen for matches found
  channel.consume('match_found_queue', (msg) => {
    if (msg) {
      const matchFound = JSON.parse(msg.content.toString());
      console.log(`Match found:`, matchFound);

      // Emit match data to the user if they are connected
      const { userId, matchUserId } = matchFound;

      if (connectedClients[userId]) {
        const socketId = connectedClients[userId];
        io.to(socketId).emit('match_found', matchFound);
        console.log(`Notified user ${userId} of match with ${matchUserId}`);
      }

      if (connectedClients[matchUserId]) {
        const socketId = connectedClients[matchUserId];
        io.to(socketId).emit('match_found', matchFound);
        console.log(`Notified user ${matchUserId} of match with ${userId}`);
      }

      channel.ack(msg);  // Acknowledge the message
    }
  });
}

// Initialize RabbitMQ connection
initRabbitMQ();

// Socket.IO connection logic
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Register the userId with the socket
  socket.on('register', (userId) => {
    connectedClients[userId] = socket.id;
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    for (const userId in connectedClients) {
      if (connectedClients[userId] === socket.id) {
        delete connectedClients[userId];
        console.log(`User ${userId} disconnected and removed from active clients.`);
        break;
      }
    }
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Notification service is running and listening on port ${PORT}`);
});
