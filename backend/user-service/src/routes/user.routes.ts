import { handleCreateUser, handleUpdateProfile, handleGetCurrentProfile } from '../controllers/user.controller'

import { Router } from 'express'

const router = Router()

router.post('/', handleCreateUser)
router.put('/:id', handleUpdateProfile)
router.get('/:id', handleGetCurrentProfile)

export default router
