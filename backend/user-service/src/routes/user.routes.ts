import { handleCreateUser, handleUpdateProfile } from '../controllers/user.controller'

import { Router } from 'express'

const router = Router()

router.post('/create', handleCreateUser)
router.post('/update-profile', handleUpdateProfile)

export default router
