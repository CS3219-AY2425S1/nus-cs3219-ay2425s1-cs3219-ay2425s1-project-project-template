import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import { Queue, IMatchRequest, IMatchCancelRequest } from "./services/queue";
import { Matcher } from "./services/matcher";
import {
  ClientSocketEvents,
  ServerSocketEvents,
  MatchRequest,
  MatchCancelRequest,
  PeerprepResponse,
} from "peerprep-shared-types";
import mongoose from "mongoose";
import { sendMessage } from "./utility/socketHelper";
import { EditorManager } from "./services/editor";
import { RoomModel } from "./models/Room";
import { Kafka } from "kafkajs";

dotenv.config();

const app = express();
const server = http.createServer(app);
const port = process.env.MATCHING_SERVICE_PORT;

// MongoDB Atlas connection string
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error("MONGODB_URI is not defined in the environment variables.");
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Matching Service is running!");
});

// Get a room by ID
app.get("/room/:id", async (req, res) => {
  try {
    const room = await RoomModel.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: "Error fetching question", error });
  }
});

const kafka = new Kafka({
  clientId: "test-consumer",
  brokers: [`kafka-service:${process.env.KAFKA_BROKER_PORT}`],
});

const consumer = kafka.consumer({ groupId: "test-group" });

const run = async () => {
  await consumer.connect();

  await consumer.subscribe({
    topic: "collaboration-events",
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log("=== New Message ===");
      console.log("Topic:", topic);
      console.log("Partition:", partition);
      console.log("Key:", message.key?.toString());
      console.log("Value:", message.value?.toString());
      console.log("Timestamp:", message.timestamp);
      console.log("==================\n");
    },
  });
};

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  run();
});

const io = new Server(server, {
  path: "/socket.io",
  cors: {
    origin: "*", // In production, replace with your frontend's URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const queue = new Queue();
const matcher = new Matcher(queue, sendResponse.bind(this));

const handleRequestMatch = async (socket: Socket, message: MatchRequest) => {
  console.log("Received match request:", message);
  const matchRequest: IMatchRequest = {
    username: message.username,
    topic: message.selectedTopic,
    difficulty: message.selectedDifficulty,
    timestamp: message.timestamp ? parseInt(message.timestamp) : Date.now(),
  };
  console.log(matchRequest);

  const result = await queue.add(matchRequest);
  console.log(result);

  if (result.success) {
    sendResponse(ServerSocketEvents.MATCH_REQUESTED, message.username, result);

    setTimeout(() => {
      matcher.start();
    }, 1000); // Delayed to allow requests to be properly added to the queue
  }
};

const handleCancelMatch = async (
  socket: Socket,
  message: MatchCancelRequest
) => {
  console.log("Received cancel request:", message);
  const cancelRequest: IMatchCancelRequest = {
    username: message.username,
  };

  const result = await queue.cancel(cancelRequest);
  console.log(result);

  if (result.success) {
    sendResponse(ServerSocketEvents.MATCH_CANCELED, message.username, result);
  }
};

const editorManager = new EditorManager();

io.on("connection", (socket) => {
  console.log("Connected to API Gateway");

  socket.on(ClientSocketEvents.REQUEST_MATCH, (message: MatchRequest) =>
    handleRequestMatch(socket, message)
  );
  socket.on(ClientSocketEvents.CANCEL_MATCH, (message: MatchCancelRequest) =>
    handleCancelMatch(socket, message)
  );

  // Handle room joining with editor initialization
  // Handle room joining
  socket.on(
    ClientSocketEvents.JOIN_ROOM,
    async (message: { roomId: string; username: string }) => {
      try {
        console.log("Received join room request:", message);
        const { roomId, username } = message;

        // Verify room and user authorization
        const room = await RoomModel.findById(roomId);
        if (!room || !room.users.includes(username)) {
          socket.emit("error", { message: "Not authorized to join this room" });
          return;
        }

        // Clean up if user was in another room
        const previousUserData = editorManager.getUserData(socket.id);
        if (previousUserData && previousUserData.roomId !== roomId) {
          console.log(
            "User was in another room:",
            previousUserData.roomId,
            "auto leaving..."
          );
          socket.leave(previousUserData.roomId);
          editorManager.removeUserFromRoom(socket.id);
          io.to(previousUserData.roomId).emit(ClientSocketEvents.USER_LEFT, {
            username: previousUserData.username,
            activeUsers:
              editorManager.getRoomState(previousUserData.roomId)
                ?.activeUsers || [],
          });
        }

        // Initialize room if needed and add user
        const editorState = editorManager.initializeRoom(roomId);
        console.log("Editor state:", editorState);
        editorManager.addUserToRoom(socket.id, username, roomId);

        socket.join(roomId);

        // Send initial state to new user
        socket.emit(ClientSocketEvents.EDITOR_STATE, {
          content: editorState.content[username] || "",
          language: editorState.language,
          activeUsers: editorState.activeUsers,
        });

        // Notify others in the room
        socket.to(roomId).emit(ClientSocketEvents.USER_JOINED, {
          username,
          activeUsers: editorState.activeUsers,
        });

        // Debug log
        console.log(`User ${username} joined room ${roomId}`);
        editorManager.debugState();
      } catch (error) {
        console.error("Error joining room:", error);
        socket.emit("error", { message: "Failed to join room" });
      }
    }
  );

  // Handle code changes
  socket.on(ClientSocketEvents.CODE_CHANGE, (message) => {
    console.log("Received code change");
    console.log(message);
    const content = message.sharedCode;
    const userData = editorManager.getUserData(socket.id);
    console.log(userData);
    if (!userData) return;

    const { username, roomId } = userData;
    editorManager.updateCode(roomId, username, content);

    // Broadcast to others in the same room
    // socket.to(roomId).emit(, {
    //   username,
    //   content,
    // });
  });

  socket.on("disconnect", () => {
    // Clean up user from their room
    const userData = editorManager.getUserData(socket.id);
    if (userData) {
      const { roomId } = userData;
      editorManager.removeUserFromRoom(socket.id);
      io.to(roomId).emit(ClientSocketEvents.USER_LEFT, {
        username: userData.username,
        activeUsers: editorManager.getRoomState(roomId)?.activeUsers || [],
      });
    }

    console.log("Disconnected from API Gateway");
    socket.disconnect(true);
    editorManager.debugState();
  });
});

function sendResponse(
  event:
    | ServerSocketEvents.MATCH_FOUND
    | ServerSocketEvents.MATCH_REQUESTED
    | ServerSocketEvents.MATCH_CANCELED
    | ServerSocketEvents.MATCH_TIMEOUT,
  username: string,
  message?: any
) {
  console.log("Notifying client:", event, username, message);

  const response: PeerprepResponse = {
    event: event,
    username,
    ...message,
  };

  sendMessage(io, response);
}
