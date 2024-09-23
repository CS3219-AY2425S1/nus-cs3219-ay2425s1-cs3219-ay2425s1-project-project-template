import { Router } from 'express'
import passport from 'passport'
import { handleLogin, handleReset, handleVerify } from '../controllers/auth.controller'

const router = Router()

router.post('/login', passport.authenticate('local', { session: false }), handleLogin)
router.post('/reset', handleReset)
router.post('/verify', handleVerify)

export default router
