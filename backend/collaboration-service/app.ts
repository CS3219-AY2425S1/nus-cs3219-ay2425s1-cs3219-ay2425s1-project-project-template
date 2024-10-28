import "dotenv/config";
import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import { startRabbitMQ } from "./consumer";
import { authenticateAccessToken } from "./utils/jwt";
import mongoose from "mongoose";
import { checkAuthorisedUser, getQuestionHandler } from "./controllers/controller";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const MONGO_URI_CS = process.env.MONGO_URI_CS;

const app = express();
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser()); // Add cookie-parser middleware

mongoose
  .connect(MONGO_URI_CS!)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Failed to connect to MongoDB:", error));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: FRONTEND_URL },
});

app.get("/api/check-authorization", checkAuthorisedUser);
app.get("/api/get-question", getQuestionHandler);

interface UsersAgreedEnd {
  [roomId: string]: Record<string, boolean>;
}

const usersAgreedEnd: UsersAgreedEnd = {};

io.on("connection", (socket) => {
  console.log("New connection:", socket.id);

  // Retrieve accessToken from cookies in the handshake headers
  const accessToken = socket.handshake.headers.cookie
    ?.split("; ")
    .find((cookie) => cookie.startsWith("accessToken="))
    ?.split("=")[1];

  if (!accessToken) {
    socket.emit("error", { errorMsg: "Not authorized, no access token" });
    socket.disconnect();
    return;
  }
  console.log("AccessToken received from cookie:", accessToken);

  authenticateAccessToken(accessToken)
    .then((user) => {
      socket.data.user = user;

      // Room joining
      socket.on("join-room", (roomId: string, username: string) => {
        socket.join(roomId);
        socket.data.roomId = roomId;
        socket.data.username = username;
        console.log(`User: ${username} joined ${roomId}}`)

        socket.emit("room-joined", roomId);
        io.to(roomId).emit("user-join", username);
      });

      // User-agreed-end event
      socket.on("user-agreed-end", (roomId: string, userId: string) => {
        usersAgreedEnd[roomId] = usersAgreedEnd[roomId] || {};
        usersAgreedEnd[roomId][userId] = true;

        console.log(`User: ${userId} agreed to end in ${roomId}}`)

        if (Object.keys(usersAgreedEnd[roomId]).length === 2) {
          io.to(roomId).emit("both-users-agreed-end", roomId);
          usersAgreedEnd[roomId] = {};
        } else {
          io.to(roomId).emit("waiting-for-other-user-end", roomId);
        }
      });

      // Handle disconnect
      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        if (socket.data.roomId) {
          io.to(socket.data.roomId).emit("user-disconnect", socket.data.username);
        }
      });
    })
    .catch((error) => {
      console.log("Authentication failed:", error);
      socket.emit("error", { errorMsg: "Not authorized, access token failed" });
      socket.disconnect();
    });
});

// Starting RabbitMQ Consumer
startRabbitMQ(io);

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});