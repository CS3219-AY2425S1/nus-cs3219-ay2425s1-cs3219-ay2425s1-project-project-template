import passport, { DoneCallback } from 'passport'
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt'
import config from '../common/config.util'
import { findOneUserById } from '../models/user.repository'
import { IAccessTokenPayload } from '../types/IAccessTokenPayload'
import { UserDto } from '../types/UserDto'

const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.ACCESS_TOKEN_PUBLIC_KEY,
}

passport.use(
    'jwt',
    new Strategy(options, async (payload: IAccessTokenPayload, done: DoneCallback) => {
        const user = await findOneUserById(payload.id)
        if (!user) {
            return done(null, false)
        }

        const dto = UserDto.fromModel(user)
        return done(null, dto)
    })
)
