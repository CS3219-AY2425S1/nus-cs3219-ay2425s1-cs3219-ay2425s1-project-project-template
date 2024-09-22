import { handleAuthentication, handleLogin, handleReset, handleVerify } from '../controllers/auth.controller'

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
router.put('/reset', handleReset)
router.put('/verify', handleVerify)

export default router
