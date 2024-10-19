import express from 'express';

import { getAttemptedQuestions, addAttemptedQuestion } from '@/controllers/questions';


const router = express.Router();

router.get('/:userId/attempted-questions/', getAttemptedQuestions)
router.post('/:userId/attempt-question', addAttemptedQuestion)

export default router;
