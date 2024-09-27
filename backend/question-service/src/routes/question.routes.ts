import passport from 'passport'
import {
    handleCreateQuestion,
    handleDeleteQuestion,
    handleGetPaginatedQuestions,
    handleGetQuestionById,
    handleUpdateQuestion,
} from '../controllers/question.controller'

import { Role } from '@repo/user-types'
import { Router } from 'express'
import { handleRoleBasedAccessControl } from '../middlewares/accessControl.middleware'

const router = Router()

router.use(passport.authenticate('jwt', { session: false }))

router.get('/', handleGetPaginatedQuestions)
router.get('/:id', handleGetQuestionById)
router.post('/', handleRoleBasedAccessControl([Role.ADMIN]), handleCreateQuestion)
router.put('/:id', handleRoleBasedAccessControl([Role.ADMIN]), handleUpdateQuestion)
router.delete('/:id', handleRoleBasedAccessControl([Role.ADMIN]), handleDeleteQuestion)

export default router
