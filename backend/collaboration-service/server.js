require("dotenv").config();
const cors = require('cors');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// Set up Express
const app = express();
const server = http.createServer(app);
app.use(cors())

const io = new Server(server, {
  cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
  }
});


io.on('connection', (socket) => {
  console.log('New client connected');

  // Broadcast incoming messages to all connected clients
  /**
  socket.on('message', (message) => {
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
  */

  socket.on('message', (message) => {
    socket.broadcast.emit('message', message);
  });

  socket.on('close', () => {
    console.log('Client disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 5002;
server.listen(PORT, () => {
  console.log(`WebSocket server is running on ws://localhost:${PORT}`);
});
