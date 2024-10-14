import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import userRoutes from "./api/routes/userRoutes";
import questionRoutes from "./api/routes/questionRoutes";
import { authenticateToken, authenticateSocket } from "./utility/jwtHelper";
import { Server, Socket as ServerSocket } from "socket.io";
import { io as Client, Socket as ClientSocket } from "socket.io-client";
import {
  ServicesSocket,
  ClientSocketEvents,
  getTargetService,
} from "./api/routes/socketRoutes";
import http from "http";
import cors from "cors";

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.API_GATEWAY_PORT;

if (!port) {
  console.error("API_GATEWAY_PORT is not set in the environment variables");
  process.exit(1);
}

app.use(cors());
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

const matchingServiceSocket = Client(`http://localhost:5003`);
matchingServiceSocket.on("connect", () => {
  console.log("Connected to matching service");
});
matchingServiceSocket.on("serverToClient", (message: any) => {
  console.log(`Received message from matching service: ${message}`);
  if (validateClientTransfer(message)) {
    const socket = connections.get(message.connectionId);
    if (socket == null) {
      console.error("No socket found for connectionId");
      return;
    }

    socket.emit(message.event, message);
  }
});
matchingServiceSocket.on("connect_error", (err) => {
  console.error(`connect_error due to ${err}`);
});
matchingServiceSocket.on("disconnect", () => {
  matchingServiceSocket.disconnect();
  console.log("Disconnected from matching service");
});

matchingServiceSocket.emit("clientToServer", { event: "test" });
console.log("match", matchingServiceSocket.connected);

// Client Sockets connection
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: `*`,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let connections: Map<string, ServerSocket> = new Map();
io.use(authenticateSocket).on("connection", (socket: ServerSocket) => {
  console.log(`User connected: ${socket.data.username}`);
  connections.set(socket.id, socket);

  socket.on("clientToServer", async (message) => {
    const event = message.event;
    if (event == null || event == undefined) {
      console.error("No event specified in message");
      return;
    }

    const targetService = getTargetService(event);
    if (targetService == null) {
      console.error("No target service for event");
      return;
    }
    message.connectionId = socket.id;
    console.log(`Received message from client: ${JSON.stringify(message)}`);
    console.log(`Forwarding message to service: ${targetService}`);

    socketTransfer(targetService, event, message);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.data.username}`);
    connections.delete(socket.id);
    socket.disconnect(true);
  });
});

matchingServiceSocket.on("connect_error", (err) => {
  console.error(`connect_error due to ${err}`);
});

// Transfer message from client to server
function socketTransfer(
  service: ServicesSocket,
  event: ClientSocketEvents,
  message: any
) {
  switch (service) {
    case ServicesSocket.MATCHING_SERVICE:
      message.event = event;
      matchingServiceSocket.emit("clientToServer", message);
      break;
    default:
      break;
  }
}

function validateClientTransfer(message: any): boolean {
  if (message.event == null || message.event == undefined) {
    console.error("No event specified in message");
    return false;
  }
  if (message.connectionId == null || message.connectionId == undefined) {
    console.error("No connectionId specified in message");
    return false;
  }

  return true;
}

// Start the server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
