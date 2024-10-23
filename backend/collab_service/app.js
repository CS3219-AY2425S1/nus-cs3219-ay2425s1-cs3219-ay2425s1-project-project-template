const cors = require("cors"); 
const express = require("express");
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require("body-parser");
const collabRoutes = require('./routes/collabRoutes');
const firebaseConfig = require("./config/firebaseConfig"); // Ensure Firebase is initialized
const authenticateToken = require('./middleware/authenticateToken');
const { collabController, socketSessions } = require('./controllers/collabController');
const app = express();

// Allow requests from http://localhost:3000 (production frontend) and http://localhost:5173 (development frontend) with credentials
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Handle URL-encoded data
app.use(authenticateToken);

// Routes
app.use('/', collabRoutes);

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Initialize HTTP server and Socket.IO
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Move socket event handling to the controller
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  collabController.handleSocketEvents(io, socket);

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

module.exports = server;
