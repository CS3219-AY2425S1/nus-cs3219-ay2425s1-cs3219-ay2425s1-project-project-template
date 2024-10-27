const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { PeerServer } = require('peer');
const path = require('path');

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
}));


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Frontend origin
    methods: ['GET', 'POST']
  }
});

const peerServer = PeerServer({ port: 5001, path: '/peerjs' });
app.use('/peerjs', peerServer);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(5000, () => {
  console.log('Express and Socket.IO server running on port 5000');
});
