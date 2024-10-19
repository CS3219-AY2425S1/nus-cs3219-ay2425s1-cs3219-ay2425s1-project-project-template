const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const sessionRoutes = require('./routes/sessionRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files
app.use(express.static('public'));

// Use the session routes (passing `io` for socket handling)
sessionRoutes(io);

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
