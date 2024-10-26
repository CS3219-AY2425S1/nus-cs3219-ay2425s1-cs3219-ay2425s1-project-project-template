// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Relay signals for WebRTC setup
  socket.on('offer', (data) => {
    socket.broadcast.emit('offer', data);
  });

  socket.on('answer', (data) => {
    socket.broadcast.emit('answer', data);
  });

  socket.on('candidate', (data) => {
    socket.broadcast.emit('candidate', data);
  });

  // Handle chat messages
  socket.on('chatMessage', (details) => {
    io.emit('chatMessage', details);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const MY_NETWORK_IP = '192.168.1.248';
const LOCALHOST = 'localhost';
const PORT = 8080;

// set to run on localhost or network ip here
const addr = LOCALHOST;

server.listen(PORT, addr, () => {
  console.log(`Server is running on http://${addr}:${PORT}`);
});
