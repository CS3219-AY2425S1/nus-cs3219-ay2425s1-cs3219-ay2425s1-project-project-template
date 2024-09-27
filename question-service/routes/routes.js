import { Router } from 'express';
import { getAllQuestions, getQuestionById, getQuestionByDifficulty, getQuestionByTopic, getNextAvailId, getQuestionByFilter } from '../controller/read.js';
import { createNewQuestion } from '../controller/create.js';
import { updateQuestion } from '../controller/update.js';
import { deleteQuestion } from '../controller/delete.js';

const router = Router();

/**
 * CREATE
 */

router.post('/', createNewQuestion);

/**
 * READ
 */

router.get('/all', getAllQuestions);

router.get('/id/:id', getQuestionById);

router.get('/difficulty/:difficulty', getQuestionByDifficulty);

router.get('/topic/:topic', getQuestionByTopic);

router.get('/nextid', getNextAvailId);

router.post('/filter', getQuestionByFilter);

/**
 * UPDATE
 */

router.put('/:id', updateQuestion);

/**
 * DELETE
 */

router.delete('/:id', deleteQuestion);


export default router;