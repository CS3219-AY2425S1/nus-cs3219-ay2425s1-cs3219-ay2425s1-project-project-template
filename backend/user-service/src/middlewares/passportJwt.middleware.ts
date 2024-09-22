import passport from 'passport'
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt'
import config from '../common/config.util'
import { handleAuthorisation } from '../controllers/auth.controller'

const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.ACCESS_TOKEN_PUBLIC_KEY,
    issuer: 'user-service',
    audience: 'frontend',
}

passport.use('jwt', new Strategy(options, handleAuthorisation))
