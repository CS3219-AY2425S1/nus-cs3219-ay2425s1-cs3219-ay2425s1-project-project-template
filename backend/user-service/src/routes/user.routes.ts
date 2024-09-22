import {
    handleCreateUser,
    handleDeleteUser,
    handleUpdatePassword,
    handleUpdateProfile,
} from '../controllers/user.controller'

import { Router } from 'express'

const router = Router()

router.post('/', handleCreateUser)
router.put('/:id', handleUpdateProfile)
router.delete('/:id', handleDeleteUser)
router.put('/password/:id', handleUpdatePassword)

export default router
