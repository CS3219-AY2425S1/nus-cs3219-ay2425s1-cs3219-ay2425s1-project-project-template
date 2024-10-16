const { db } = require('../config/firebaseConfig');

class CollabController {
  joinSession = async (req, res) => {
    const { sessionId, userId } = req.body;

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

module.exports = new CollabController();
