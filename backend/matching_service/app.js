const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const firebaseConfig = require("./config/firebaseConfig"); // Ensure Firebase is initialized
const {
  authenticateToken,
  authenticateTokenSocket,
} = require("./middleware/authenticateToken");
const { createServer } = require("http");
const { createClient } = require("redis");
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");
const { SocketController } = require("./controllers/socketController");
const amqplib = require("amqplib");

// Initialize Express app
const app = express();

// Apply middleware
app.use(
  cors({
    origin: [
      "https://frontend-1079323726684.asia-southeast1.run.app",
      "http://localhost:3000",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

// Use the authenticateToken middleware for http(s) connections
app.use(authenticateToken); 

app.use(bodyParser.json());

// Create HTTP server
const server = createServer(app);

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

const rabbitMQUrl = process.env.RABBITMQ_URL || "amqp://localhost";
let connection;

const connectRabbitMQ = async () => {
  try {
    connection = await amqplib.connect(rabbitMQUrl);
    console.log("Connected to RabbitMQ");
  } catch (error) {
    console.error("Error connecting to RabbitMQ: ", error);
  }
}

// Connect the client instances to Redis, as well as connect the server to RabbitMQ
const initializeServices = async () => {
  await connectRedis();
  await connectRabbitMQ();
};

const startSocketIOServer = async () => {
  await initializeServices();

  // Initialize Socket.IO server with CORS support and redis adapter
  const io = new Server(server, {
    cors: {
      origin: [
        "https://frontend-1079323726684.asia-southeast1.run.app",
        "http://localhost:3000",
        "http://localhost:5173",
      ],
      credentials: true,
    },
    adapter: createAdapter(pubClient, subClient),
  }).of("/matching");

  // Use the authenticateToken middleware for Socket.IO connections
  io.use(authenticateTokenSocket);

  // Instantiate the SocketController
  const controller = new SocketController(io, pubClient, subClient, connection);

  // Handle Socket.IO connections
  io.on("connection", (socket) => {
    controller.handleConnection(socket);
  });
};

startSocketIOServer();

module.exports = server;
