import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { validateSocketConnection } from "./utility/socketHelper";
import { Queue, IMatchRequest, IMatchCancelRequest } from "./services/queue"; // Import your Queue class

dotenv.config();

const app = express();
const server = http.createServer(app);
const port = process.env.MATCHING_SERVICE_PORT;

app.use(cors());
app.use(express.json());

const queue = new Queue();

app.get("/", (req, res) => {
  res.send("Matching Service is running!");
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const io = new Server(server, {
  path: "/socket.io",
  cors: {
    origin: "*", // In production, replace with your frontend's URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to API Gateway");

  socket.on("clientToServer", async (message: any) => {
    console.log(message);
    if (validateSocketConnection(message)) {
      let result;
      switch (message.event) {
        case "match_request":
          const matchRequest: IMatchRequest = {
            id: message.id || Date.now().toString(), // Generate an ID if not provided
            userId: message.userId,
            topic: message.topic,
            difficulty: message.difficulty,
          };
          result = await queue.add(matchRequest);
          break;
        case "cancel_request":
          const cancelRequest: IMatchCancelRequest = { id: message.id };
          result = await queue.cancel(cancelRequest);
          break;
        case "get_requests":
          result = { requests: await queue.getRequests() };
          break;
        default:
          result = { error: "Unknown event type" };
      }
      result = "Success";
      socket.emit("serverToClient", result);
    }
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from API Gateway");
    socket.disconnect(true);
  });
});
