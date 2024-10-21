// routes/collabRoutes.js
const express = require('express');
const router = express.Router();
const CollabController = require('../controllers/collabController');
const ExecuteCodeController = require('../controllers/executeCodeController');

// Route for joining a session
router.post('/join-session', CollabController.joinSession);

// Route to terminate a session
router.post('/terminate-session', CollabController.terminateSession);

// Route for executing code
router.post('/execute-code', ExecuteCodeController.executeCode);

module.exports = router;

