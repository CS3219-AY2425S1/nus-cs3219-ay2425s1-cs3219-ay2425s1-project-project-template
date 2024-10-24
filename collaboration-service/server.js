const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const sessionRoutes = require('./routes/sessionRoutes');
const { authMiddleware } = require('./middleware/authMiddleware');
const { PORT } = require('./config');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files
app.use(express.static('public'));

// Use the session routes at the '/api/collab' path (passing `io` for socket handling)
app.use('/api/collab', authMiddleware, sessionRoutes(io));

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});