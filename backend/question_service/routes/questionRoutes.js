const express = require('express');
const { getAllQuestions, getQuestionsOfTopicAndDifficulty, createQuestion, editQuestion, deleteQuestion } = require('../controllers/questionController');
const authenticateToken = require('../middleware/authenticateToken');
const isAdminCheck = require('../middleware/isAdminCheck');
const router = express.Router();

// Route to get all questions (homepage)
router.get('/get-all-questions', authenticateToken, getAllQuestions);

// Route to get all questions of a certain topic and difficulty
router.post('/get-questions-of-topic-and-difficulty', authenticateToken, getQuestionsOfTopicAndDifficulty);

// Route to create a new question
router.post('/create-question', authenticateToken, isAdminCheck, createQuestion);

// Route to edit a question
router.put('/edit-question', authenticateToken, isAdminCheck, editQuestion);

// Route to delete a question
router.delete('/delete-question', authenticateToken, isAdminCheck, deleteQuestion);

module.exports = router;
