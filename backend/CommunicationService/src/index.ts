import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { initializeCommunicationSockets } from "./sockets/handlers";
import { errorMiddleware } from "./middleware/errorMiddleware";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", //config.corsOrigin? This should be set to frontend domain
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("Communication service is running");
});

const PORT = process.env.COMM_SVC_PORT ?? 4005

// Socket.io setup
initializeCommunicationSockets(io);

httpServer.listen(PORT, () => {
  console.log(`Communication Server is running on port ${PORT}`);
});
