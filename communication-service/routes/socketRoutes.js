// routes/socketRoutes.js
const { Server } = require('socket.io');
const socketController = require('../controllers/socketController');

module.exports = (httpsServer) => {
  const io = new Server(httpsServer, {
    cors: {
      origin: "*",  // Allow all origins
      methods: ['GET', 'POST'],
    },
    path: '/api/comm/socket.io',
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  // Listen for errors at the server level
  io.on('error', (error) => {
    console.error('Socket.IO error:', error);
  });

  socketController(io);  // Attach the controller
};
