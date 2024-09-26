import passport from 'passport'
import {
    handleCreateQuestion,
    handleDeleteQuestion,
    handleGetPaginatedQuestions,
    handleGetQuestionById,
    handleUpdateQuestion,
} from '../controllers/question.controller'

import { Router } from 'express'

const router = Router()

router.use(passport.authenticate('jwt', { session: false }))

router.get('/', handleGetPaginatedQuestions)
router.get('/:id', handleGetQuestionById)
router.post('/', handleCreateQuestion)
router.put('/:id', handleUpdateQuestion)
router.delete('/:id', handleDeleteQuestion)

export default router
