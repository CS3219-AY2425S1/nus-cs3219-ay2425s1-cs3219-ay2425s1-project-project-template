import { Router } from 'express'
import passport from 'passport'
import { addUserToMatchingQueue } from '../controllers/matching.controller'

const router = Router()

router.use(passport.authenticate('jwt', { session: false }))

router.post('/', addUserToMatchingQueue)

export default router
