import { Router } from 'express'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { handleAuthentication, handleLogin } from '../controllers/auth.controller'

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

export default router
