// controllers/sessionController.js

const codeSessions = {};
const chatSessions = {};

// Handle user joining a session
const joinSession = (socket, io) => {
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
};

module.exports = {
  joinSession,
};
