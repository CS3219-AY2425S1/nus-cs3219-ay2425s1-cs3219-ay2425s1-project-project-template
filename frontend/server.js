const { Server } = require("socket.io");
const http = require("http");

// Create an HTTP server to bind the socket.io server.
const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*", // Allow any origin, modify as needed for security.
    methods: ["GET", "POST"],
  },
});

// Listen for new socket connections.
io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Listen for 'any' event from clients.
  socket.on("any", (data) => {
    console.log(`Received 'any' event from ${socket.id}:`, data);

    // Broadcast the 'any' event and its data to all other clients.
    socket.broadcast.emit("any", data);
  });

  // Listen for 'any' event from clients.
  socket.on("delta", (data) => {
    console.log(`Received 'delta' event from ${socket.id}:`, data);

    // Broadcast the 'any' event and its data to all other clients.
    socket.broadcast.emit("delta", data);
  });

  // Handle client disconnection.
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Start the server on port 3000.
const PORT = 1234;
server.listen(PORT, () => {
  console.log(`Socket.io server listening on http://localhost:${PORT}`);
});
