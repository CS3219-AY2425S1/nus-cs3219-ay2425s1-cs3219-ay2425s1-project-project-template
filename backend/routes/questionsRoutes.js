const express = require('express');
const router = express.Router();

const { getQuestions, addQuestion } = require('../controllers/questionController');

router.route('/').get(getQuestions)
router.route('/').post(addQuestion)

module.exports = router;