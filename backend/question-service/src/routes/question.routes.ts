import {
    handleCreateQuestion,
    handleGetPaginatedQuestions,
    handleGetQuestionById,
} from '../controllers/question.controller'

import { Router } from 'express'

const router = Router()

router.get('/', handleGetPaginatedQuestions)
router.get('/:id', handleGetQuestionById)
router.post('/', handleCreateQuestion)

export default router
