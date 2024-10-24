// controllers/sessionController.js

const codeSessions = {};

const sessionsForUser = {};

// Handle user joining a session
const joinSession = (socket, io) => {
  socket.on('join-session', (details) => {
    const { sessionId, matchedUserId } = details;
    const userId = socket.data.userProfile._id;

    // Input validation
    if (!sessionId) {
      return socket.emit('error', 'Session ID is required.');
    }
    if (!userId) {
      return socket.emit('error', 'User ID is required.');
    }
    if (!matchedUserId) {
      return socket.emit('error', 'Matched User ID is required.');
    }
    if (userId == matchedUserId) {
      return socket.emit('error', 'User cannot be matched to him/herself.');
    }

    if (!codeSessions[sessionId]) {
      // Initialize session
      codeSessions[sessionId] = {
        code: '',
        users: new Set([userId, matchedUserId]),
        active_connections: 0,
      };
    } else if (
      !codeSessions[sessionId].users.has(userId) ||
      !codeSessions[sessionId].users.has(matchedUserId)
    ) {
      return socket.emit('error', 'Invalid user/match Id for this session ID.');
    }

    socket.join(sessionId);

    codeSessions[sessionId].active_connections += 1;
    delete codeSessions[sessionId].timeoutStart;

    sessionsForUser[userId] = {
      sessionId: sessionId,
      matchedUserId: matchedUserId,
    };

    console.log(`User ${userId} joined session ${sessionId}`);

    // Send the current code state to the newly joined user
    socket.emit('load-code', codeSessions[sessionId].code);

    // Listen for code changes in this session
    socket.on('edit-code', (newCode) => {
      codeSessions[sessionId].code = newCode;
      socket.to(sessionId).emit('code-updated', newCode);
    });

    // Notify other users in the session about the new user
    socket.to(sessionId).emit('user-joined', userId);

    socket.on('disconnect', () => {
      const codeSession = codeSessions[sessionId];

      if (!codeSession) {
        return;
      }

      socket.to(sessionId).emit('user-left', userId);

      codeSession.active_connections -= 1;
      console.log(`User ${userId} disconnected from session ${sessionId}`);

      if (codeSession.active_connections <= 0) {
        const timeoutStart = Date.now();

        codeSession.timeoutStart = timeoutStart;

        setTimeout(() => {
          if (codeSession && codeSession.timeoutStart == timeoutStart) {
            delete codeSessions[sessionId];
            if (
              sessionsForUser[userId] &&
              sessionsForUser[userId].sessionId == sessionId
            ) {
              delete sessionsForUser[userId];
            }
            if (
              sessionsForUser[matchedUserId] &&
              sessionsForUser[matchedUserId].sessionId == sessionId
            ) {
              delete sessionsForUser[matchedUserId];
            }
            console.log(`Session ${sessionId} deleted.`);
          }
        }, 360000); // 5 minutes
      }
    });
  });
};

const checkSessionForUser = (userId) => {
  const sessionForUser = sessionsForUser[userId];
  if (sessionForUser == undefined) {
    return {
      sessionId: null,
      matchedUserId: null,
    };
  } else {
    return sessionForUser;
  }
};

module.exports = {
  joinSession,
  checkSessionForUser,
};
