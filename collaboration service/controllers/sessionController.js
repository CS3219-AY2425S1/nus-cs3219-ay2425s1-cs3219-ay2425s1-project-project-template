// controllers/sessionController.js

const codeSessions = {};

// Handle user joining a session
const joinSession = (socket, io) => {
  socket.on('join-session', (sessionId) => {
    if (!sessionId) {
      return socket.emit('error', 'Session ID is required.');
    }

    socket.join(sessionId);
    console.log(`User ${socket.id} joined session ${sessionId}`);

    // Initialize session if it doesn't exist
    if (!codeSessions[sessionId]) {
      codeSessions[sessionId] = ''; // Empty initial code state
    }

    // Send the current code state to the newly joined user
    socket.emit('load-code', codeSessions[sessionId]);

    // Listen for code changes in this session
    socket.on('edit-code', (newCode) => {
      codeSessions[sessionId] = newCode;
      socket.to(sessionId).emit('code-updated', newCode);
    });
  });
};

module.exports = {
  joinSession,
};
