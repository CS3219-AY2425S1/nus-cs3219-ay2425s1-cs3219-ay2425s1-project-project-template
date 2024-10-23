const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = require("./app");
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
      origin: ['http://localhost:3000', 'http://localhost:5173'], // Frontend origins
      methods: ['GET', 'POST'],
      credentials: true // Allow cookies/credentials if needed
    }
  });

const collabRoutes = require('./routes/collabRoutes');
app.use(express.json());
app.use('/', collabRoutes);

const { collabController, socketSessions } = require('./controllers/collabController');
console.log('socketSessions initialized:', socketSessions); 

// Handle new socket connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('error', (err) => {
    console.error('Socket error:', err);
  });


  // Joining a specific collaboration session
  /*socket.on('joinSession', ({ sessionId, userId }) => {
    socket.join(sessionId);
    console.log(`User ${socket.id} joined session ${sessionId}`);

    // Emit the sessionId and userId back to the client
    socket.emit('sessionJoined', { sessionId, userId: socket.id });
  });
  */

  /*socket.on('matched', async (data) => {
    console.log('Received matched data:', data);
    // Here, emit the question data to the corresponding user in the collaboration session
    data.sessionData.uid = socket.id; // Get the userId from sessionData
    socket.to(userId).emit('questionDataReceived', data.questionData);
  });
  */

  socket.on('sessionJoined', (sessionId) => {
    console.log(`Received sessionId:`, sessionId);
    console.log('Current socketSessions:', socketSessions);
    console.log(`User ${socket.id} is trying to join session ${sessionId}`); 
    if (socketSessions && socketSessions[sessionId]) {
      socket.join(sessionId);
      console.log(`User ${socket.id} joined session ${sessionId}`);

      const sessionData = socketSessions[sessionId];
      console.log(`Emitting session data for session ${sessionId}:`, JSON.stringify(sessionData, null, 2));

      io.to(sessionId).emit('sessionData', {
        sessionIdObj: sessionId,  // Renamed sessionId to sessionIdObj for consistency
        socketId: socket.id, 
        questionData: sessionData.questionData,  // Include questionData
        });
    
      console.log(`Session data emitted for socket ${socket.id}`); // Debugging statement
    } else {
      console.error('No session data found for session ID:', sessionId); // Debugging statement
    }
  });
  
  // Handle real-time code updates
  socket.on('codeUpdate', (data) => {
    const { sessionIdObj, code } = data;
    // Broadcast the code update to all users in the same session
    console.log(`Received code update request for session: ${sessionIdObj}`);
    socket.to(sessionIdObj).emit('codeUpdated', { code });
    console.log(`Code updated in session ${sessionIdObj}: ${code}`);
  });

  socket.on('sendMessage', (data) => {
    const { sessionId, message} = data; // Extract sessionId, message, and username
    io.to(sessionId).emit('messageReceived', {
        username: socket.id, // Send the current user's username
        message, // Send the message
    });
  });


  socket.on('terminateSession', (sessionId) => {
    // Notify all users in the session except the one who terminated it
    socket.to(sessionId).emit('sessionTerminated', { userId: socket.id });
});

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

const port = 5004;

server.listen(5004, (err) => {
  if (err) {
    console.error('Error starting server:', err);
    return;
  }
  console.log(`Server is running on port ${port}`);
  console.log('Listening for WebSocket connections...');
});

module.exports = { io };