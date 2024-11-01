// routes/socketRoutes.js
const { Server } = require('socket.io');
const socketController = require('../controllers/socketController');
const { authGetUser } = require('../middleware/authMiddleware');

module.exports = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",  // Allow all origins
      methods: ['GET', 'POST'],
    },
    path: '/api/comm/socket.io',
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  /**
   * Authentication
   */
  io.on('connection', (socket) => {
    try {
      const authHeader = socket.handshake.headers['authorization'];
      const user = authGetUser(authHeader);
      socket.data.user = user;
      console.log('A user connected:', socket.data.user?.userId);
    } catch (error) {
      console.log('Error: ', error.message);
      socket.emit('error', 'Unauthorised socket connection.')
      socket.disconnect(true);
    }

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.data.user?.userId);
    });
  })

  // Listen for errors at the server level
  io.on('error', (error) => {
    console.error('Socket.IO error:', error);
  });

  

  socketController(io);  // Attach the controller
};
