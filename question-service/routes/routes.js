import { Router } from 'express';

import { createNewQuestion } from '../controller/create.js';
import { deleteQuestion } from '../controller/delete.js';
import { getImage, uploadImage } from '../controller/imageController.js';
import { getAllQuestions, getAllTopics, getNextAvailId, getOneQuestionByFilter, getQuestionByDifficulty, getQuestionByFilter, getQuestionById, getQuestionByTopic } from '../controller/read.js';
import { updateQuestion } from '../controller/update.js';
import { authMiddleware, authMiddlewareAdmin } from '../middleware/authMiddleware.js';

const router = Router();

/**
 * CREATE
 */

router.post('/', authMiddleware, authMiddlewareAdmin, createNewQuestion);

/**
 * READ
 */

router.get('/all', getAllQuestions);

router.get('/id/:id', getQuestionById);

router.get('/difficulty/:difficulty', getQuestionByDifficulty);

router.get('/topic/:topic', getQuestionByTopic);

router.post('/filter', getQuestionByFilter);

router.post('/filter-one', getOneQuestionByFilter);

router.get('/nextid', getNextAvailId);

router.get('/topics', getAllTopics);

/**
 * UPDATE
 */

router.put('/:id', authMiddleware, authMiddlewareAdmin, updateQuestion);

/**
 * DELETE
 */

router.delete('/:id', authMiddleware, authMiddlewareAdmin, deleteQuestion);

/**
 * IMAGE HANDLING
 */

router.get('/img/:filename', getImage);

router.post('/img', authMiddleware, authMiddlewareAdmin, uploadImage);

export default router;