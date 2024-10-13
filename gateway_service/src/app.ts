import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import userRoutes from "./api/routes/userRoutes";
import questionRoutes from "./api/routes/questionRoutes";
import { authenticateToken, authenticateSocket } from "./utility/jwtHelper";
import { Server, Socket as ServerSocket } from "socket.io";
import { io as Client, Socket as ClientSocket } from "socket.io-client";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.API_GATEWAY_PORT;

if (!port) {
  console.error("API_GATEWAY_PORT is not set in the environment variables");
  process.exit(1);
}

app.use(express.json());

const logRequestTimestamp = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
};

// Apply the logging middleware to all routes
app.use(logRequestTimestamp);

// Routes
app.use("/auth", userRoutes);
app.use(authenticateToken);
app.use("/api/questions", questionRoutes);

// Basic route for testing
app.get("/", (req, res) => {
  res.send("LeetCode API Gateway is running!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Sockets connection
const io = new Server(parseInt(port), {
  cors: {
    origin: `http://${process.env.FRONTEND_ROUTE}:${process.env.FRONTEND_PORT}`,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const matchingServiceSocket: ClientSocket = Client(
  `http://${process.env.MATCHING_SERVICE_ROUTE}:${process.env.MATCHING_SERVICE_PORT}`
);

matchingServiceSocket.on("serverToClient", (message: any) => {
  console.log(`Received message from matching service: ${message}`);
  io.emit("serverToClient", message);
});

io.use(authenticateSocket);
io.on("connection", (socket: ServerSocket) => {
  console.log(`User connected: ${socket.data.username}`);

  socket.on("matching", (message: any) => {
    console.log(`Received message from client: ${message}`);
    matchingServiceSocket.emit("clientToMatching", {
      user: socket.data.user,
      message: message,
    });
  });

  socket.on("disconnect", (message: any) => {
    socket.disconnect(true);
  });
});
