import { Router } from 'express';
import {
  createQuestion,
  fetchAllQuestions,
  fetchQuestionById,
  modifyQuestionById,
  removeQuestionById,
  fetchQuestionByTitle
} from '../controller/question-controller';  // Import your controller methods

const router = Router();

// Route to create a new question
router.post('/questions', createQuestion);

// Route to get all questions
router.get('/questions', fetchAllQuestions);

// Route to get a specific question by ID
router.get('/questions/:id', fetchQuestionById);

// Route to get a specific question by title
router.get('/questions/title/:title', fetchQuestionByTitle);  // New route

// Route to update a specific question by ID
router.put('/questions/:id', modifyQuestionById);

// Route to delete a specific question by ID
router.delete('/questions/:id', removeQuestionById);

export default router;
