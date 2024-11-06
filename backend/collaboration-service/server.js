require("dotenv").config();
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const SocketIO = require('socket.io');

// Set up Express
const app = express();
const server = http.createServer(app);
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  methods: ['GET', 'POST'],         // Allow specific HTTP methods
  credentials: true                  // Allow credentials (if needed)
}));

// Set up WebSocket server
const wss = new WebSocket.Server({ server });

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('New client connected');

  // Broadcast incoming messages to all connected clients
  ws.on('message', (message) => {
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// This listens for leave messages
const io = SocketIO(server, {
  cors: {
      origin: 'http://localhost:3000', // Allow requests from this origin
      methods: ['GET', 'POST'],         // Allow specific HTTP methods
      credentials: true                  // Allow credentials (if needed)
  }
});
io.on('connection', (socket) => {
  console.log("SocketIO for Collab Page Leave functionality connected");

  socket.on('joinRoom', (roomName) => {
    console.log(`Room name: ${roomName}`);
    socket.join(roomName);
  })

  socket.on('leave', (roomName) => {
    console.log(`Room name: ${roomName}`);
    socket.to(roomName).emit("leave", "Your partner has left!");
  })
  socket.on('disconnect', () => {
    console.log("SocketIO for Collab Page Leave functionality Disconnected");
  })
})


// Start the server
const PORT = process.env.PORT || 5002;
server.listen(PORT, () => {
  console.log(`WebSocket server is running on ws://localhost:${PORT}`);
});