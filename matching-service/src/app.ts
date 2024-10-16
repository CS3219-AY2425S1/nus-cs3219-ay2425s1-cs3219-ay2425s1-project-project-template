import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";

import messageRoutes from "./routes/messageRoute";
import { initRabbitMQ } from "./services/rabbitMqService";
import redisClient from "./config/redisConfig";
import { startBackgroundTransfer } from "./services/matchingService";

const envFile =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env.dev";
console.log(`Using env file: ${envFile}`);
dotenv.config({ path: envFile });

const app = express();
const PORT = process.env.PORT || 5001; // 5001 to prevent conflicts

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

  try {
    await redisClient.connect();
  } catch (err) {
    console.error("Error connecting to Redis:", err);
  }

  console.log(`Server is running on port ${PORT}`);

  startBackgroundTransfer();
});
