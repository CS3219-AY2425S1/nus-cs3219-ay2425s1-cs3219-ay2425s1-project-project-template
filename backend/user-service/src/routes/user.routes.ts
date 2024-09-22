import { Router } from 'express'
import passport from 'passport'
import {
    handleCreateUser,
    handleDeleteUser,
    handleGetCurrentProfile,
    handleUpdatePassword,
    handleUpdateProfile,
} from '../controllers/user.controller'
import handleAccessControl from '../middlewares/accessControl.middleware'
import { Role } from '../types/Role'

const router = Router()

router.post('/', handleCreateUser)

router.use(passport.authenticate('jwt', { session: false }))

router.put('/:id', handleAccessControl([Role.USER]), handleUpdateProfile)
router.get('/:id', handleAccessControl([Role.USER]), handleGetCurrentProfile)
router.delete('/:id', handleAccessControl([Role.ADMIN]), handleDeleteUser)
router.put('/:id/password', handleUpdatePassword)

export default router
