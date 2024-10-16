import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";

import messageRoutes from "./routes/messageRoute";
import { initRabbitMQ } from "./services/rabbitMqService";
import redisClient from "./config/redisConfig";
import { startBackgroundTransfer } from "./services/matchingService";

dotenv.config({ path: ".env.dev" });

const app = express();
const PORT = process.env.PORT || 5001; // 5001 to prevent conflicts
const QUEUE = process.env.MATCHING_SERVICE_QUEUE || "matching-service";

app.use(express.json());
app.use(cors()); // config cors so that front-end can use
app.options("*", cors());

const apiVersion = "/api/v1";

// Allow frontend to talk to service
app.use(cors({ origin: true, credentials: true }));

app.use(`${apiVersion}/message`, messageRoutes);

// ping server
app.get(`${apiVersion}/ping`, (req, res) => {
  res.status(200).json({ data: "pong" });
});

// Start the server
app.listen(PORT, async () => {
  await initRabbitMQ(QUEUE);
  try {
    await redisClient.connect();
  } catch (err) {
    console.error("Error connecting to Redis:", err);
  }
  console.log(`Server is running on port ${PORT}`);

  startBackgroundTransfer();
});
