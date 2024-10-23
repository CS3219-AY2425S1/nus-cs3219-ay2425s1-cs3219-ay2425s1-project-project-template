const { db } = require('../config/firebaseConfig');
const socketSessions = {};

class CollabController {
  /*joinSession = async (req, res) => {
    const { sessionId } = req.body;
    const userId = req.socket.id;

    try {
      const sessionRef = db.collection('sessions').doc(sessionId);
      const sessionSnapshot = await sessionRef.get();

      if (!sessionSnapshot.exists) {
        await sessionRef.set({ code: '', users: [userId], messages: [] });
      } else {
        await sessionRef.update({
          users: admin.firestore.FieldValue.arrayUnion(userId),
        });
      }

      res.status(200).json({ message: 'Joined session successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to join session' });
    }
  }
  */

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
