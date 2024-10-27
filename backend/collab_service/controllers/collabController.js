const { db } = require('../config/firebaseConfig');

class CollabController {

  handleSocketEvents = (io, socket) => {
    socket.on('sessionJoined', async (sessionId, uid) => {
      console.log(`Received sessionId:`, sessionId);
      console.log(`User ${uid} is trying to join session ${sessionId}`);
      try {
        const sessionRef = db.collection("sessions").doc(sessionId);
        const doc = await sessionRef.get();

        if (doc.exists) {
          socket.join(sessionId);
          console.log(`User ${uid} joined session ${sessionId}`);

          const data = doc.data();

          socket.emit('sessionData', {
            sessionIdObj: sessionId,  // Renamed sessionId to sessionIdObj for consistency
            uid: uid, 
            questionData: data.questionData,  // Include questionData
          });

          console.log(`Session data emitted for socket ${socket.id}`);
        } else {
          console.log("No document exists");
        }
      } catch (error) {
        console.error(`Error when getting session ${sessionId} from database`); 
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

    socket.on('terminateSession', async (sessionId) => {
      io.to(sessionId).emit('sessionTerminated', { userId: socket.id });

      // Delete the session from our database
      try {
        await db.collection('sessions').doc(sessionId).delete();
      } catch (error) {
        console.error(`Unable to delete session ${sessionId} from database`);
      }
    });
  };


  handleSessionCreated = async (req, res) => {
      // Debugging: Log incoming request data
      console.log('Incoming request data:', req.body);

      const { sessionId, sessionData, questionData} = req.body; 

      // Check if sessionId and sessionData are provided
      if (!sessionId || !sessionData || !questionData) {
          console.error("Missing sessionId or sessionData or questionData:", { sessionId, sessionData, questionData });
          return res.status(400).json({ message: "All of sessionId, sessionData, and questionData are required." });
      }

      try {
        const sessionRef = db.collection('sessions').doc(sessionId);
        await sessionRef.set({
          sessionData: sessionData,
          questionData: questionData,
        }); 
        } catch (error) {
          console.error('Error saving session data to Firestore:', error);
          return res.status(500).json({ message: 'Failed to save session data.' });
        }

      return res.status(200).json({ message: 'Users added to session successfully.', sessionData: sessionData });
  }
}

const collabControllerInstance = new CollabController();

module.exports = {
  collabController: collabControllerInstance, // Export the instance
};
