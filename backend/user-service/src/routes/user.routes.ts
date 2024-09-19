import { Router } from 'express'
import { handleCreateUser } from '../controllers/user.controller'

const router = Router()

router.post('/', handleCreateUser)

export default router
