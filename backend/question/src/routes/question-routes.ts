import { Router } from 'express';
import {
  searchQuestionsByTitle,
  getQuestions,
  getQuestionDetails,
  getRandomQuestion,
} from '../controller/search-controller';

const router = Router();

router.get('/search', searchQuestionsByTitle);

router.get('/', getQuestions);

router.get('/:questionId', getQuestionDetails);

router.get('/random', getRandomQuestion);

export default router;
