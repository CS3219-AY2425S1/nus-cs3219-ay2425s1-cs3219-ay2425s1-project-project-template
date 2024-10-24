const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

// This route serves the socket connection for session handling
module.exports = (io) => {
  io.on('connection', (socket) => {
    // Delegate session handling to the controller
    sessionController.joinSession(socket, io);
  });

  router.get('/test', (req, res) => {
    return res.send('hello');
  })

  // Handle session check for a specific user
  router.get('/check-session/:userId', (req, res) => {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const sessionDetails = sessionController.checkSessionForUser(userId);
    return restatus(200).json(sessionDetails);
  });

  return router;
};
