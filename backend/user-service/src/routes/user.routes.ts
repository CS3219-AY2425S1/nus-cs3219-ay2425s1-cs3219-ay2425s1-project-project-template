import {
    handleCreateUser,
    handleDeleteUser,
    handleGetCurrentProfile,
    handleUpdatePassword,
    handleUpdateProfile,
} from '../controllers/user.controller'

import { Router } from 'express'

const router = Router()

router.post('/', handleCreateUser)
router.put('/:id', handleUpdateProfile)
router.get('/:id', handleGetCurrentProfile)
router.delete('/:id', handleDeleteUser)
router.put('/:id/password', handleUpdatePassword)

export default router
