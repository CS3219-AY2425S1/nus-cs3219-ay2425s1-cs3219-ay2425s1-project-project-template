// routes/collabRoutes.js
const express = require('express');
const router = express.Router();
const { collabController, socketSessions } = require('../controllers/collabController');
const ExecuteCodeController = require('../controllers/executeCodeController');

// Route for joining a session
//router.post('/join-session', CollabController.joinSession);

// Route to terminate a session
router.post('/terminate-session', collabController.terminateSession);

router.post('/create-session', collabController.handleSessionCreated);

// Route for executing code
router.post('/execute-code', ExecuteCodeController.executeCode);

module.exports = router;

