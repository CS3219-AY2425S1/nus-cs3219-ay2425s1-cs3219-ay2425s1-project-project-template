const express = require('express');
const router = express.Router();

const { getQuestions } = require('../controllers/questionController');

router.route('/').get(getQuestions)

module.exports = router;