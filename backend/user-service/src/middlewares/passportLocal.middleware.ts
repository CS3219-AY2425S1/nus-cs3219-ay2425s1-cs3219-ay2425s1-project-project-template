import passport from 'passport'
import { Strategy } from 'passport-local'
import { handleAuthentication } from '../controllers/auth.controller'

passport.use(
    'local',
    new Strategy(
        {
            usernameField: 'usernameOrEmail',
            passwordField: 'password',
            session: false,
            passReqToCallback: false,
        },
        handleAuthentication
    )
)
