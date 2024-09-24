import { getPaginatedQuestions, handleCreateQuestion } from '../controllers/question.controller'

import { Router } from 'express'
import { validatePagination } from '../middlewares/paginationHandler.middleware'

const router = Router()

router.get('/questions', validatePagination, getPaginatedQuestions)
router.post('/', handleCreateQuestion)

export default router
