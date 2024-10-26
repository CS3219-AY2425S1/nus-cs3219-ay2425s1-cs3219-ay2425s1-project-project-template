// server.js
const express = require('express');
const http = require('http');
const https = require('https');
const path = require('path');
const cors = require('cors');
const { Server } = require('socket.io');
const { SSL_CERT, SSL_KEY } = require('./config');

const app = express();
app.use(cors());

const MY_NETWORK_IP = '192.168.1.248'; // Network IP
const PORT = 8443;

// SSL certificates
const options = {
  key: SSL_KEY,
  cert: SSL_CERT,
};

// Redirect HTTP to HTTPS
const httpServer = http.createServer((req, res) => {
  res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
  res.end();
});

httpServer.listen(8080, MY_NETWORK_IP);

// Create HTTPS server on the specified network IP
const httpsServer = https.createServer(options, app);

httpsServer.listen(PORT, MY_NETWORK_IP, () => {
  console.log(`Server is running on https://${MY_NETWORK_IP}:${PORT}`);
});

app.use(express.static(path.join(__dirname, 'public')));

const io = new Server(httpsServer, {
  cors: {
    origin: "*",  // Allow all origins
    methods: ['GET', 'POST'],
  },
  // path: '/api/comm/socket.io',
  pingTimeout: 60000,  // Set a higher timeout (e.g., 60 seconds)
  pingInterval: 25000,  // Interval between ping packets
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('offer', (data) => {
    socket.broadcast.emit('offer', data);
  });

  socket.on('answer', (data) => {
    socket.broadcast.emit('answer', data);
  });

  socket.on('candidate', (data) => {
    socket.broadcast.emit('candidate', data);
  });

  socket.on('chatMessage', (msg) => {
    io.emit('chatMessage', msg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
