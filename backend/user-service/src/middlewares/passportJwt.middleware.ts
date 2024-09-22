import passport from 'passport'
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt'
import config from '../common/config.util'
import { handleAuthorisation } from '../controllers/auth.controller'

const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    algorithms: ['RS256'],
    secretOrKey: Buffer.from(config.ACCESS_TOKEN_PUBLIC_KEY, 'base64'),
    issuer: 'user-service',
    audience: 'frontend',
}

passport.use('jwt', new Strategy(options, handleAuthorisation))
