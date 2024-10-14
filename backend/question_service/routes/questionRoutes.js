const express = require('express');
const { getAllQuestions, getQuestionsOfTopicAndDifficulty, createQuestion, deleteQuestion } = require('../controllers/questionController');
const router = express.Router();

// Route to get all questions (homepage)
router.get('/get-all-questions', getAllQuestions);

// Route to get all questions of a certain topic and difficulty
router.post('/get-questions-of-topic-and-difficulty', getQuestionsOfTopicAndDifficulty)

// Route to create a new question
router.post('/create-question', createQuestion);

// Route to delete a question
router.delete('/delete-question', deleteQuestion);

module.exports = router;
