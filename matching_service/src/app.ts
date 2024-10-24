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

      try {
        const messageValue = JSON.parse(message.value?.toString() || "");
        console.log("Message Type:", messageValue.type); // This will print "JOIN_ROOM"

        // Now you can switch on the message type
        switch (messageValue.type) {
          case ClientSocketEvents.JOIN_ROOM:
            console.log("Room ID:", messageValue.roomId);
            console.log("Socket ID:", messageValue.socketId);
            break;
          // Add other cases as needed
        }
      } catch (error) {
        console.error("Error parsing message:", error);
        console.error("Raw message value:", message.value?.toString());
      }
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
