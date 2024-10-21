import express from "express";
import cors from "cors";
import http from "http";
import messageRoutes from "./routes/messageRoute";
import { initRabbitMQ } from "./services/rabbitMqService";
import redisClient from "./config/redisConfig";
import { startBackgroundTransfer } from "./services/matchingService";
import WebSocketService from "./services/webSocketService";

const app = express();
const server = http.createServer(app);
const webSocketService = new WebSocketService(server);

const PORT = process.env.PORT || 5001; // 5001 to prevent conflicts

app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options("*", cors());

const apiVersion = "/api/v1";

// Allow frontend to talk to service
app.use(cors({ origin: true, credentials: true }));

// Mainly to check health or state of service
app.use(`${apiVersion}/`, messageRoutes);

export const notifyMatch = async (
  user1Id: string,
  user2Id: string,
  matchData: any,
) => {
  await webSocketService.notifyMatch(user1Id, user2Id, matchData);
};

server.listen(PORT, async () => {
  await initRabbitMQ();

  try {
    await redisClient.connect();
  } catch (err) {
    console.error("Error connecting to Redis:", err);
  }

  console.log(`Server is running on port ${PORT}`);

  startBackgroundTransfer();
});
