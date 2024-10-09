import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import cors from "cors";
import jwt from "jsonwebtoken";
import { joinRoomWhenReady } from "./services/socket";

const app = express();
const server = http.createServer(app);
const port = 5004;

app.use(cors());
app.use(express.json());

const io = new Server(server, {
  path: "/socket.io",
  cors: {
    origin: "*", // In production, replace with your frontend's URL
    methods: ["GET", "POST"],
  },
});

const JWT_SECRET = process.env.JWT_SECRET || "";

app.get("/", (req, res) => {
  res.send("Matching Service is running!");
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error: Token not provided"));
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) {
      return next(new Error("Authentication error: Invalid token"));
    }
    console.log(decoded);
    socket.data.user = decoded;
    next();
  });
});

io.on("connection", (socket) => {
  console.log("A user connected. Socket ID:", socket.id);
  console.log(socket.handshake.auth.token);

  socket.on("match", ({ selectedDifficulty, selectedTopic }) => {
    console.log(selectedDifficulty);
    console.log(selectedTopic);
    // todo queue processing logic which will create a room upon successful match
    // const socket2 = null;
    // joinRoomWhenReady(socket, null, selectedDifficulty, selectedTopic);
  });

  socket.on("quitSession", ({ roomId }) => {
    console.log("A user clicked on quit session");

    // inform other user in the room that the guy has left
    // socket.to(roomId).emit("quitSession");
  });

  // todo add matching from client

  // todo

  socket.on("disconnect", (reason) => {
    //remove user from the room
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
