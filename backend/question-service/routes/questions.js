const express = require('express');
const router = express.Router();
const questionsController = require('../controllers/questionsController');


router.get('/', questionsController.getAllQuestions)
router.post('/', questionsController.createQuestion)
router.put('/:id', questionsController.updateQuestion)
router.delete('/', questionsController.deleteQuestion)

// Get question based on id
router.get('/:id', questionsController.getQuestion);

module.exports = router;