require("dotenv").config();
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

// Set up Express
const app = express();
const server = http.createServer(app);

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

// Start the server
const PORT = process.env.PORT || 5002;
server.listen(PORT, () => {
  console.log(`WebSocket server is running on ws://localhost:${PORT}`);
});
