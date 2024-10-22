import { Router } from 'express'
import passport from 'passport'

const router = Router()

router.use(passport.authenticate('jwt', { session: false }))

// To change this route to enable retrival of sessions with pagination
router.get('/')

export default router
