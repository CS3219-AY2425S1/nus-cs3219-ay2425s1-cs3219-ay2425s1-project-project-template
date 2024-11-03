import { Router } from 'express'
import passport from 'passport'
import { createSessionRequest, getSession } from '../controllers/collab.controller'

const router = Router()

router.use(passport.authenticate('jwt', { session: false }))

// To change this route to enable retrival of sessions with pagination
router.put('/', createSessionRequest)
router.get('/:id', getSession)

export default router
