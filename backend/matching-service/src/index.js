import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectMongoDB, connectRabbitMQ, getChannel } from "./connections.js";
import {
  addUser,
  getMatchQueue,
  removeUser,
  initializeMatchQueue,
} from "./matchQueue.js";
import { initializeWebSocketServer, notifyUser } from "./websocket.js";

dotenv.config();

const app = express();
let channel;

app.use(express.json());
app.use(cors());

const initialize = async () => {
  await connectMongoDB();
  await connectRabbitMQ();
  channel = getChannel();
  await initializeMatchQueue();
  await processMatchRequests();
};

initialize().catch(console.error);

initializeWebSocketServer(process.env.WEBSOCKET_PORT || 8080);

// Boolean function for hard matching criteria: topic and difficulty must match
const meetHardMatchingCriteria = (user1, user2) => {
  return (
    user1.topic === user2.topic &&
    user1.difficulty === user2.difficulty &&
    user1.userId !== user2.userId
  );
};

// Boolean function for soft matching criteria: only topic must match
const meetSoftMatchingCriteria = (user1, user2) => {
  return user1.topic === user2.topic && user1.userId !== user2.userId;
};

const processMatchRequests = async () => {
  await channel.consume("match_requests", async (request) => {
    if (request !== null) {
      const matchRequest = JSON.parse(request.content.toString());
      const matchQueue = await getMatchQueue();
      let matched = false;

      // Matches with hard criteria (same topic and difficulty)
      for (let i = 0; i < matchQueue.length; i++) {
        if (meetHardMatchingCriteria(matchQueue[i], matchRequest)) {
          const user1 = matchQueue[i];
          const user2 = matchRequest;
          await removeUser(user1.userId);
          await removeUser(user2.userId);
          notifyUser(user1.userId, "matched");
          notifyUser(user2.userId, "matched");
          matched = true;
          break;
        }
      }

      // Matches with soft criteria (same topic, different difficulty)
      if (!matched) {
        for (let i = 0; i < matchQueue.length; i++) {
          if (meetSoftMatchingCriteria(matchQueue[i], matchRequest)) {
            const user1 = matchQueue[i];
            const user2 = matchRequest;
            await removeUser(user1.userId);
            await removeUser(user2.userId);
            notifyUser(user1.userId, "matched");
            notifyUser(user2.userId, "matched");
            break;
          }
        }
      }

      channel.ack(request);
    }
  });

  await channel.consume("notifications", async (msg) => {
    if (msg !== null) {
      const notification = JSON.parse(msg.content.toString());
      notifyUser(notification.userId, notification.status);
      channel.ack(msg);
    }
  });
};

app.post("/match", async (req, res) => {
  console.log("Received /match request:", req.body);
  const user = req.body;
  try {
    const result = await addUser(user);
    if (result.error) {
      console.error("Error adding user:", result.error);
      res.status(400).send(result.error);
    } else {
      console.log("User added successfully:", result.success);
      res.status(200).send(result.success);
    }
  } catch (error) {
    console.error("Exception occurred:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/queue", async (req, res) => {
  console.log("Received /queue request");
  try {
    const queueStatus = await getMatchQueue();
    res.status(200).send(queueStatus);
  } catch (error) {
    console.error("Exception occurred:", error);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.MATCHING_SERVICE_PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
