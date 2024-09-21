import { handleCreateUser, handleDeleteUser, handleUpdateProfile } from '../controllers/user.controller'

import { Router } from 'express'

const router = Router()

router.post('/', handleCreateUser)
router.put('/:id', handleUpdateProfile)
router.delete('/:id', handleDeleteUser)

export default router
