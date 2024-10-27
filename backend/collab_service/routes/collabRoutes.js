const express = require('express');
const router = express.Router();
const { collabController, socketSessions } = require('../controllers/collabController');
const ExecuteCodeController = require('../controllers/executeCodeController');


// Route to create a session
router.post('/create-session', collabController.handleSessionCreated);

// Route for executing code
router.post('/execute-code', ExecuteCodeController.executeCode);

module.exports = router;

