import express from 'express';

import { getAttemptedQuestions, addAttemptedQuestion } from '@/controllers/questions';


const router = express.Router();

router.post('/attempted-question/get', getAttemptedQuestions)
router.post('/attempted-question/add', addAttemptedQuestion)

export default router;
