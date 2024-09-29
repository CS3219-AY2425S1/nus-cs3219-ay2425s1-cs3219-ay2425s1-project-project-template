import { Router } from 'express';

import {
  searchQuestionsByTitle,
  getQuestions,
  getQuestionDetails,
  getRandomQuestion,
} from '@/controller/question-controller';

const router = Router();

router.get('/search', searchQuestionsByTitle);

router.get('/', getQuestions);

router.get('/:questionId', getQuestionDetails);

router.post('/random', getRandomQuestion);

export default router;
