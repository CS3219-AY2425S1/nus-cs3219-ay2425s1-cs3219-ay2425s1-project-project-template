const { db } = require('../config/firebaseConfig');
const socketSessions = {};

class CollabController {

  handleSocketEvents = (io, socket) => {
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
    
        console.log(`Session data emitted for socket ${socket.id}`);
      } else {
        console.error('No session data found for session ID:', sessionId);
      }
    });

    socket.on('codeUpdate', (data) => {
      const { sessionIdObj, code } = data;
      console.log(`Received code update request for session: ${sessionIdObj}`);
      socket.to(sessionIdObj).emit('codeUpdated', { code });
      console.log(`Code updated in session ${sessionIdObj}: ${code}`);
    });

    socket.on('sendMessage', (data) => {
      const { sessionId, message } = data;
      io.to(sessionId).emit('messageReceived', {
        username: socket.id,
        message,
      });
    });

    socket.on('terminateSession', (sessionId) => {
      io.to(sessionId).emit('sessionTerminated', { userId: socket.id });
    });
  };


  handleSessionCreated = async (req, res) => {
      // Debugging: Log incoming request data
      console.log('Incoming request data:', req.body);

      const { sessionId, sessionData, questionData} = req.body; // Assuming this is how you're getting data

      // Check if sessionId and sessionData are provided
      if (!sessionId || !sessionData) {
          console.error('Missing sessionId or sessionData:', { sessionId, sessionData });
          return res.status(400).json({ message: 'Both sessionId and sessionData are required.' });
      }

      // Debugging: Log sessionId and sessionData
      console.log('Session ID:', sessionId);
      console.log('Session Data:', sessionData);

      // Initialize session if it doesn't exist
      if (!socketSessions[sessionId]) {
          socketSessions[sessionId] = {
              users: [], // Array to hold user IDs
              prevUserSessionData: {}, // Object for previous user session data
              currUserSessionData: {}  // Object for current user session data
          };
      }

      // Extract previous and current user session data
      const { prevUserSessionData, currUserSessionData } = sessionData;

      // Add previous user session data if it exists
      if (prevUserSessionData && prevUserSessionData.uid) {
          socketSessions[sessionId].prevUserSessionData = prevUserSessionData;
          console.log(`Previous user session data added to session ${sessionId}:`, prevUserSessionData);

          // Add the previous user to the session
          if (!socketSessions[sessionId].users.includes(prevUserSessionData.uid)) {
              socketSessions[sessionId].users.push(prevUserSessionData.uid); // Add previous user
              console.log(`User ${prevUserSessionData.uid} added to session ${sessionId}.`);
          } else {
              console.log(`User ${prevUserSessionData.uid} is already in session ${sessionId}.`);
          }
      }

      // Add current user session data if it exists
      if (currUserSessionData && currUserSessionData.uid) {
          socketSessions[sessionId].currUserSessionData = currUserSessionData;
          console.log(`Current user session data added to session ${sessionId}:`, currUserSessionData);
          console.log('Current socketSessions:', socketSessions);

          // Add the current user to the session
          if (!socketSessions[sessionId].users.includes(currUserSessionData.uid)) {
              socketSessions[sessionId].users.push(currUserSessionData.uid); // Add current user
              console.log(`User ${currUserSessionData.uid} added to session ${sessionId}.`);
          } else {
              console.log(`User ${currUserSessionData.uid} is already in session ${sessionId}.`);
          }
      }

      try {
        const sessionRef = db.collection('sessions').doc(sessionId);
        socketSessions[sessionId].questionData = questionData; // Add questionData to session data
        await sessionRef.set(socketSessions[sessionId]);  // Save all session data including questionData
        } catch (error) {
          console.error('Error saving session data to Firestore:', error);
          return res.status(500).json({ message: 'Failed to save session data.' });
        }

      return res.status(200).json({ message: 'Users added to session successfully.', sessionData: socketSessions[sessionId] });
  }

  terminateSession = async (req, res) => {
    const { sessionId } = req.body;

    try {
      await db.collection('sessions').doc(sessionId).delete();
      res.status(200).json({ message: 'Session terminated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to terminate session' });
    }
  }
}

const collabControllerInstance = new CollabController();

module.exports = {
  collabController: collabControllerInstance, // Export the instance
  socketSessions, // Export socketSessions
};
