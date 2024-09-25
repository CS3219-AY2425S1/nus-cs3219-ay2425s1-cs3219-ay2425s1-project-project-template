import express from 'express';
import {
  fetchAllQuestions,
  addQuestion,
  updateQuestionById,
  deleteQuestionById
} from '../controllers/question-controller';

const router = express.Router();

// Routes for the question service
router.get('/', fetchAllQuestions);
router.post('/', addQuestion);
router.put('/:id', updateQuestionById)
router.delete('/:id', deleteQuestionById)

export default router;
