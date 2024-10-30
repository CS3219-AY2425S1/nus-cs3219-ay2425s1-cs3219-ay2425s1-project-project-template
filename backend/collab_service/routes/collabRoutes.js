const express = require('express');
const router = express.Router();
const { collabController } = require('../controllers/collabController');
const ExecuteCodeController = require('../controllers/executeCodeController');


// Route to create a session
router.post("/create-session", collabController.handleSessionCreated);

// Route to verify if a session exists or not
router.post("/verify-session", collabController.handleVerifySession);

// Route for executing code
router.post("/execute-code", ExecuteCodeController.executeCode);


module.exports = router;

