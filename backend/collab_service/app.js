const cors = require("cors"); 
const express = require("express");
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require("body-parser");
const collabRoutes = require('./routes/collabRoutes');
const firebaseConfig = require("./config/firebaseConfig"); // Ensure Firebase is initialized
const {
  authenticateToken,
  authenticateTokenSocket,
} = require("./middleware/authenticateToken");
const { createClient } = require("redis");
const { createAdapter } = require("@socket.io/redis-adapter");
const { collabController } = require('./controllers/collabController');
const app = express();

// Allow requests from http://localhost:3000 (production frontend) and http://localhost:5173 (development frontend) with credentials
app.use(cors({
  origin: [
    "https://frontend-1079323726684.asia-southeast1.run.app",
    "http://localhost:3000",
    "http://localhost:5173",
  ],
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

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

// Create Redis client instances (one for publishing, and a duplicate for subscribing)
const pubClient = createClient({ url: redisUrl });
const subClient = pubClient.duplicate();

const connectRedis = async () => {
  try {
    await Promise.all([
      pubClient.connect(), 
      subClient.connect()
    ]);
    console.log("Connected to Redis");
  } catch (error) {
    console.error("Error connecting to Redis:", error);
  }
};

// Connect the client instances to Redis
const initializeServices = async () => {
  await connectRedis();
};

const startSocketIOServer = async () => {
  await initializeServices();

  const io = socketIo(server, {
    cors: {
      origin: [
        "https://frontend-1079323726684.asia-southeast1.run.app",
        "http://localhost:3000",
        "http://localhost:5173",
      ],
      credentials: true,
    },
    adapter: createAdapter(pubClient, subClient),
  });

  io.use(authenticateTokenSocket);
  
  // Move socket event handling to the controller
  io.on("connection", (socket) => {
    console.log('A socket connected:', socket.id);
  
    collabController.handleSocketEvents(io, socket);
  
    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('A socket disconnected:', socket.id);
    });
  });
}

startSocketIOServer();

module.exports = server;
