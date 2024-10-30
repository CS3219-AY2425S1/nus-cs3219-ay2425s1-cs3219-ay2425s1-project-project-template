const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const { authMiddlewareSocket } = require('../middleware/authMiddleware');
const axios = require('axios');

// This route serves the socket connection for session handling
module.exports = (io) => {
  // health check
  router.get('/', (req, res) => {
    return res.send('hello world');
  });

  async function fetchQuestions(url) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching questions:', error.message);
      throw error;
    }
  }

  router.post('/test', async (req, res) => {
    try {
      const url = req.body.url;
      const result = await fetchQuestions(url);
      res.send(result);
    } catch (error) {
      res.status(500).json(error);
    }
  })

  // Handle session check for a specific user
  router.get('/check-session', (req, res) => {
    try {
      const userId = req.user.userId;

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const sessionDetails = sessionController.checkSessionForUser(userId);
      return res.status(200).json(sessionDetails);
    } catch (error) {
      return res.status(500).json({ error: 'Unknown error' });
    }
  });

  io.on('connection', async (socket) => {
    // Delegate session handling to the controller
    console.log(`Socket ${socket.id} connected`);
    try {
      const token = socket.handshake.auth.token;
      const user = await authMiddlewareSocket(token);
      socket.data.user = user;
      sessionController.joinSession(socket, io);
    } catch (error) {
      console.log(error);
      socket.emit('error', { message: 'Unauthorized socket connection.' });
      socket.disconnect(true);
    }
  });

  return router;
};
