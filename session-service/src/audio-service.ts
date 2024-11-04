import { Server, Socket } from "socket.io";
import { createServer } from "http";
import express from "express";
import cors from "cors";

// Define the shape of the audio data
interface AudioData {
  buffer: Float32Array; // Assuming audio data is sent as a Float32Array
  // Add more fields if necessary, e.g., sampleRate, channels, etc.
}

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  credentials: true,
}));
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Adjust this to your needs
    methods: ["GET", "POST"],
    credentials: true,
    allowedHeaders: ["*"]
  },
  path: "/socket.io/",
  transports: ["websocket"],
  pingTimeout: 60000,
  pingInterval: 30000,
  connectTimeout: 45000,
});

// Add connection error handling
io.engine.on("connection_error", (err) => {
  console.log('Connection error:', err);
});

io.on("connection", (socket: Socket) => {
  console.log("New client connected for audio service", socket.id);

  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });

  // Handle incoming audio data and broadcast to other clients
  socket.on("audio-data", (data: AudioData) => {
    socket.broadcast.emit("audio-data", data);
  });

  // Handle signaling data for WebRTC connections
  socket.on("signal", (signalData) => {
    // Broadcast the signaling data to other clients
    socket.broadcast.emit("signal", signalData);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected from audio service");
  });
});

app.get('/health', (req, res) => {
  res.send('Server is running');
});

const PORT = process.env.AUDIO_PORT || 5555;
httpServer.listen(PORT, () => {
  console.log(`Audio service is running on port ${PORT}`);
});