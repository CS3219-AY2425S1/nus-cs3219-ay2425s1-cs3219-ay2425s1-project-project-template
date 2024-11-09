const express = require('express');
const {
  getAllQuestions,
  getQuestionsOfTopicAndDifficulty,
  createQuestion,
  editQuestion,
  deleteQuestion,
  getQuestionsByIds,
} = require("../controllers/questionController");
const isAdminCheck = require('../middleware/isAdminCheck');
const router = express.Router();

// Route to get all questions (homepage)
router.get('/get-all-questions', getAllQuestions);

// Route to get all questions of a certain topic and difficulty
router.post('/get-questions-of-topic-and-difficulty', getQuestionsOfTopicAndDifficulty);

// Route to create a new question
router.post('/create-question', isAdminCheck, createQuestion);

// Route to edit a question
router.put('/edit-question', isAdminCheck, editQuestion);

// Route to delete a question
router.delete('/delete-question', isAdminCheck, deleteQuestion);

// route to get question(s) by question id
router.post("/get-questions-by-ids", getQuestionsByIds);

module.exports = router;
