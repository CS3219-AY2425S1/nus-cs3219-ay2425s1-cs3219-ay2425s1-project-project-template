const express = require('express');
const { getAllAttemptedQuestions, createQuestionAttempted, storeExecutedCode } = require('../controllers/historyController');
const router = express.Router();

// Route to get all attempted questions for a user
router.post("/get-all-attempted-questions", getAllAttemptedQuestions);

// Route to create a question attempted session for a user
router.post("/create-question-attempted", createQuestionAttempted);

// Route to store user executed code for a user attempted session
router.post("/store-user-executed-code", storeExecutedCode);

module.exports = router;
