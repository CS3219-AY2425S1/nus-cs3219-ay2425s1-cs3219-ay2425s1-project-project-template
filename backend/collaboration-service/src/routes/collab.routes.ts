import { Router } from 'express'
import passport from 'passport'
import { createSessionRequest, getSession, submitCode } from '../controllers/collab.controller'

const router = Router()

router.use(passport.authenticate('jwt', { session: false }))

// To change this route to enable retrival of sessions with pagination
router.put('/', createSessionRequest)
router.get('/:id', getSession)
router.post('/submit', submitCode)

export default router
