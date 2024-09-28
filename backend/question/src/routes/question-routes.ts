import { Router } from 'express';
import { searchQuestionsByTitle } from '../controller/search-controller';

const router = Router();

router.get('/search', searchQuestionsByTitle);

export default router;
