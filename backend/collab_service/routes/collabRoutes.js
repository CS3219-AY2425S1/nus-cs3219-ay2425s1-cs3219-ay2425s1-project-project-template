// routes/collabRoutes.js
const express = require('express');
const router = express.Router();
const CollabController = require('../controllers/collabController');

// Route for joining a session
router.post('/join-session', CollabController.joinSession);

// Route to terminate a session
router.post('/terminate-session', CollabController.terminateSession);

module.exports = router;

