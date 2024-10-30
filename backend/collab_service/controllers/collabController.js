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
      const { sessionId, message, uid } = data;
      io.to(sessionId).emit('messageReceived', {
        username: uid,
        message,
      });
    });

    socket.on('terminateSession', async (data) => {
      const { sessionId, uid } = data;
      try {
        // Delete the session from our database
        await db.collection('sessions').doc(sessionId).delete();
      } catch (error) {
        console.error(`Unable to delete session ${sessionId} from database`);
      }
      socket.to(sessionId).emit('userLeft', { userId: uid });
      socket.emit('sessionTerminated', { userId: uid });
    });
  };


  handleSessionCreated = async (req, res) => {
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

  handleVerifySession = async (req, res) => {
    const { sessionId } = req.body;
    // Check if sessionId is provided
    if (!sessionId ) {
      console.error("Missing sessionId");
      return res.status(400).json({ success: false, message: "sessionId is required." });
    }

    try {
      const sessionRef = db.collection("sessions").doc(sessionId);
      const doc = await sessionRef.get();

      if (doc.exists) {
        return res.status(200).json({ success: true, message: "Session found." });
      } else {
        return res.status(404).json({ success: false, message: "Session not found." });
      }
    } catch (error) {
      console.error(`Error when getting session ${sessionId} from database`);
      return res.status(500).json({ success: false, message: `Error when getting session ${sessionId} from database` }); 
    }
  }
}

const collabControllerInstance = new CollabController();

module.exports = {
  collabController: collabControllerInstance, // Export the instance
};
