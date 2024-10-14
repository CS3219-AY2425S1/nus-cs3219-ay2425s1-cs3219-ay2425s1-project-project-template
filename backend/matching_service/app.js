const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const firebaseConfig = require("./config/firebaseConfig"); // Ensure Firebase is initialized
const {
  authenticateToken,
  authenticateTokenSocket,
} = require("./middleware/authenticateToken");
const { createServer } = require("http"); // Use 'http' instead of 'node:http'
const { Server } = require("socket.io");
const { SocketController } = require("./controllers/socketController");

// Initialize Express app
const app = express();

// Apply middleware
app.use(
  cors({
    origin: ["https://frontend-1079323726684.asia-southeast1.run.app", "http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);

app.use(authenticateToken);
app.use(bodyParser.json());

// Create HTTP server
const server = createServer(app);

// Create Socket.IO server with CORS support
const io = new Server(server, {
  cors: {
    origin: ["https://frontend-1079323726684.asia-southeast1.run.app", "http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  },
}).of("/matching");

// Use the authenticateToken middleware for Socket.IO connections
io.use(authenticateTokenSocket);

// Instantiate the SocketController
const controller = new SocketController();

// Handle Socket.IO connections
io.on("connection", (socket) => {
  controller.handleConnection(socket);
});

// Export the server if needed for testing or other purposes
module.exports = server;
