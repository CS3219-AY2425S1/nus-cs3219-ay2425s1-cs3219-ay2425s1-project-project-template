import { Router } from 'express';

import {
  createQuestion,
  deleteQuestion,
  getDifficulties,
  getQuestionDetails,
  getQuestions,
  getRandomQuestion,
  getTopics,
  searchQuestionsByTitle,
  updateQuestion,
} from '@/controller/question-controller';

import { createAttempt } from '../controller/attempted-controller';
import { fetchUnattemptedQuestion } from '../controller/unattempted-controller';

const router = Router();

router.get('/search', searchQuestionsByTitle);

router.get('/topic', getTopics);
router.get('/difficulties', getDifficulties);

router.get('/', getQuestions);

router.get('/:questionId', getQuestionDetails);

router.post('/random', getRandomQuestion);

router.post('/create', createQuestion);
router.put('/:questionId', updateQuestion);
router.delete('/:questionId', deleteQuestion);

router.post('/unattempted', fetchUnattemptedQuestion);
router.post('/newAttempt', createAttempt);

export default router;
