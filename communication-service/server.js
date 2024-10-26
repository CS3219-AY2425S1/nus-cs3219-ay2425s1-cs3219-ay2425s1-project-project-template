// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const https = require('https');
const { SSL_CERT, SSL_KEY } = require('./config');

const app = express();
const server = http.createServer(app);

const MY_NETWORK_IP = '192.168.1.248'; // for testing
const LOCALHOST = 'localhost';

// set to run on localhost or network ip here
const addr = LOCALHOST;

// ssl certs
const options = {
  key: SSL_KEY,
  cert: SSL_CERT
}

const httpsServer = https.createServer(options, app);

const httpServer = http.createServer((req, res) => {
  res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
  res.end();
});

httpServer.listen(80);
httpsServer.listen(443);

// server.listen(PORT, addr, () => {
//   console.log(`Server is running on http://${addr}:${PORT}`);
// });

const io = new Server(https);

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


