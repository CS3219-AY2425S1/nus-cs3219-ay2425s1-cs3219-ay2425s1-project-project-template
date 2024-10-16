import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";

import messageRoutes from "./routes/messageRoute";
import { initRabbitMQ, subscribeToQueue } from "./services/rabbitMqService";
import redisClient from "./config/redisConfig";
import {
  processNewUser,
  startBackgroundTransfer,
} from "./services/matchingService";
import { User } from "./types";

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

// Mainly to check health or state of service
app.use(`${apiVersion}/`, messageRoutes);

// Start the server
app.listen(PORT, async () => {
  await initRabbitMQ();

  // Subscribe to the matching service queue
  await subscribeToQueue<User>(QUEUE, processNewUser);

  try {
    await redisClient.connect();
  } catch (err) {
    console.error("Error connecting to Redis:", err);
  }

  console.log(`Server is running on port ${PORT}`);

  startBackgroundTransfer();
});
