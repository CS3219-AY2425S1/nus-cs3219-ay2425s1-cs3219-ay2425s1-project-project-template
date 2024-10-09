import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

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

app.get("/", (req, res) => {
  res.send("Matching Service is running!");
});

io.on("connection", (socket) => {
  console.log("A user connected. Socket ID:", socket.id);

  socket.on("test client", (message) => {
    console.log("Received from client:", message);
    socket.emit("test server", `Server received: ${message}`);
  });

  // todo add matching from client

  // todo

  socket.on("disconnect", (reason) => {
    console.log(
      `User disconnected. Socket ID: ${socket.id}. Reason: ${reason}`
    );
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
