const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Store code states and chat messages for each session (room)
const codeSessions = {};
const chatSessions = {};

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for session joining
  socket.on('join-session', (sessionId) => {
    socket.join(sessionId);
    console.log(`User ${socket.id} joined session ${sessionId}`);

    // Initialize session if it doesn't exist
    if (!codeSessions[sessionId]) {
      codeSessions[sessionId] = ''; // Empty initial code state
      chatSessions[sessionId] = [];  // Empty chat log
    }

    // Send the current code state and chat history to the newly joined user
    socket.emit('load-code', codeSessions[sessionId]);
    socket.emit('load-chat', chatSessions[sessionId]);

    // Listen for code changes in this session
    socket.on('edit-code', (newCode) => {
      codeSessions[sessionId] = newCode;
      socket.to(sessionId).emit('code-updated', newCode);
    });

    // Listen for chat messages in this session
    socket.on('send-message', (message) => {
      const chatMessage = { user: socket.id, text: message };
      chatSessions[sessionId].push(chatMessage);

      // Broadcast the new message to others in the same session
      io.to(sessionId).emit('new-message', chatMessage);
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Serve static files
app.use(express.static('public'));

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
