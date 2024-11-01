import { connectToMongo } from "./model/repository.js";
import http from "http";
import index from "./index.js";
import { Server } from "socket.io";
import { addMessageToChat } from "./model/repository.js";

const PORT = process.env.PORT || 5000;
const server = http.createServer(index);

const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins; replace with specific origin if needed
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected to Socket.IO");

  // Join a room based on roomId
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  // Handle incoming chat messages
  socket.on("sendMessage", async (data) => {
    const { roomId, userId, text } = data;
    const newMessage = await addMessageToChat(roomId, userId, text);

    // Broadcast the message to all clients in the same room
    io.to(roomId).emit("chatMessage", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected from Socket.IO");
  });
});

connectToMongo()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
