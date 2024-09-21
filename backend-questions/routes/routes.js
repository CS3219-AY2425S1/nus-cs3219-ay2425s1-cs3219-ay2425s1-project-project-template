import { Router } from 'express';
import { getAllQuestions, getQuestionById, getQuestionByDifficulty } from '../controller/controller.js';
const router = Router();

router.get('/all', getAllQuestions);

router.get('/id/:id', getQuestionById);

router.get('/difficulty/:difficulty', getQuestionByDifficulty);

export default router;