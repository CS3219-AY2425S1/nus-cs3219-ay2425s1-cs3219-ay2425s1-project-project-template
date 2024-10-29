import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", //config.corsOrigin? This should be set to frontend domain
    methods: ["GET", "POST"],
  },
});

app.get("/", (req, res) => {
  res.send("Communication service is running");
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const PORT = 5000;
httpServer.listen(PORT, () => {
  console.log(`Communication Server is running on port ${PORT}`);
});
