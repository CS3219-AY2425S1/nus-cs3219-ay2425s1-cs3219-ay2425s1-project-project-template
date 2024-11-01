import { Router } from 'express'
import passport from 'passport'
import { generateWS, getMatchDetails, updateCompletion } from '../controllers/matching.controller'

const router = Router()

router.put('/', updateCompletion)
router.use(passport.authenticate('jwt', { session: false }))
router.post('/', generateWS)
router.get('/:id', getMatchDetails)

export default router
