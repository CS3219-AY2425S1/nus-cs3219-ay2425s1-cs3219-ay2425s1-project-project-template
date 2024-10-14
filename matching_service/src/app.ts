import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import { validateSocketConnection } from "./utility/socketHelper";
import { Queue, IMatchRequest, IMatchCancelRequest } from "./services/queue";
import {
  ClientSocketEvents,
  ServerSocketEvents,
  MatchRequest,
  MatchCancelRequest,
} from "peerprep-shared-types";

dotenv.config();

const app = express();
const server = http.createServer(app);
const port = process.env.MATCHING_SERVICE_PORT;

app.use(cors());
app.use(express.json());

// const queue = new Queue();

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

const handleRequestMatch = async (socket: Socket, message: MatchRequest) => {
  console.log("Received match request:", message);
  const matchRequest: IMatchRequest = {
    id: Date.now().toString(),
    userId: message.username,
    topic: message.selectedTopic,
    difficulty: message.selectedDifficulty,
  };
  console.log(matchRequest);
  try {
    // const result = await queue.add(matchRequest);
    // socket.emit("serverToClient", {
    //   event: ServerSocketEvents.MATCH_FOUND,
    //   ...result,
    // });
  } catch (error) {
    // socket.emit("serverToClient", {
    //   event: ServerSocketEvents.MATCH_ERROR,
    //   error: error.message,
    // });
  }
};

const handleCancelMatch = async (
  socket: Socket,
  message: MatchCancelRequest
) => {
  console.log("Received cancel request:", message);

  const cancelRequest: IMatchCancelRequest = {
    id: message.username,
  };
  try {
    // const result = await queue.cancel(message);
    // socket.emit("serverToClient", {
    //   event: ServerSocketEvents.MATCH_CANCELED,
    //   ...result,
    // });
  } catch (error) {
    // socket.emit("serverToClient", {
    //   event: ServerSocketEvents.MATCH_ERROR,
    //   error: error.message,
    // });
  }
};

const handleGetRequests = async (socket: Socket) => {
  console.log("Received get requests");
  try {
    // const requests = await queue.getRequests();
    // socket.emit("serverToClient", { event: "requests_list", requests });
  } catch (error) {
    // socket.emit("serverToClient", {
    //   event: ServerSocketEvents.MATCH_ERROR,
    //   error: error.message,
    // });
  }
};

io.on("connection", (socket) => {
  console.log("Connected to API Gateway");

  // if (!validateSocketConnection(socket)) {
  //   console.log("Invalid socket connection");
  //   socket.disconnect(true);
  //   return;
  // }

  socket.on(ClientSocketEvents.REQUEST_MATCH, (message: MatchRequest) =>
    handleRequestMatch(socket, message)
  );
  socket.on(ClientSocketEvents.CANCEL_MATCH, (message: MatchCancelRequest) =>
    handleCancelMatch(socket, message)
  );
  socket.on("get_requests", () => handleGetRequests(socket));

  socket.on("disconnect", () => {
    console.log("Disconnected from API Gateway");
    socket.disconnect(true);
  });
});
