import { handleAuthentication, handleLogin } from '../controllers/auth.controller'

import { Strategy as LocalStrategy } from 'passport-local'
import { Router } from 'express'
import passport from 'passport'

passport.use(
    'local',
    new LocalStrategy(
        {
            usernameField: 'usernameOrEmail',
            passwordField: 'password',
            session: false,
            passReqToCallback: false,
        },
        handleAuthentication
    )
)

const router = Router()

router.post('/login', passport.authenticate('local', { session: false }), handleLogin)
router.post('/password')
router.put('/password')

export default router
