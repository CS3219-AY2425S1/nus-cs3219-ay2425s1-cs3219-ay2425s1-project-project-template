import { Router } from 'express';

import {
  searchQuestionsByTitle,
  getQuestions,
  getQuestionDetails,
  getRandomQuestion,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} from '@/controller/question-controller';

const router = Router();

router.get('/search', searchQuestionsByTitle);

router.get('/', getQuestions);

router.get('/:questionId', getQuestionDetails);

router.post('/random', getRandomQuestion);

router.post('/questions', createQuestion);
router.put('/questions/:questionId', updateQuestion);
router.delete('/questions/:questionId', deleteQuestion);

export default router;
