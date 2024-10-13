import express from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { validateSocketConnection } from "./utility/socketHelper";
import { evaluate } from "./routes/matchingRoutes";

dotenv.config();

const app = express();
const server = http.createServer(app);
const port = process.env.MATCHING_SERVICE_PORT;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Matching Service is running!");
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const io = new Server(server, {
  path: "/socket.io",
  cors: {
    origin: "*", // In production, replace with your frontend's URL
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Connected to API Gateway");

  socket.on("clientToServer", (message: any) => {
    console.log(message);
    if (validateSocketConnection(message)) {
      const result = evaluate(message.event, message);
      result.connectionId = message.connectionId;
      socket.emit("serverToClient", result);
    }
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from API Gateway");
    socket.disconnect(true);
  });
});
