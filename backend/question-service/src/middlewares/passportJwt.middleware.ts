import { IAccessTokenPayload } from '@repo/user-types/IAccessTokenPayload'
import { IUserDto } from '@repo/user-types/IUserDto'
import axios, { AxiosResponse } from 'axios'
import { Request } from 'express'
import passport, { DoneCallback } from 'passport'
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt'
import config from '../common/config.util'

const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    algorithms: ['RS256'],
    secretOrKey: Buffer.from(config.ACCESS_TOKEN_PUBLIC_KEY, 'base64'),
    issuer: 'user-service',
    audience: 'frontend',
    passReqToCallback: true,
}

async function handleAuthorisation(request: Request, payload: IAccessTokenPayload, done: DoneCallback): Promise<void> {
    const id = payload.id
    const authToken = request.headers.authorization

    // Should replace this with a gRPC call in the future
    let response: AxiosResponse<IUserDto>
    try {
        response = await axios.get<IUserDto>(`${config.USER_SERVICE_URL}/users/${id}`, {
            headers: { authorization: authToken },
        })
    } catch {
        return done(null, false)
    }

    const user = response.data
    if (!user) {
        return done(null, false)
    }

    return done(null, user)
}

passport.use('jwt', new Strategy(options, handleAuthorisation))
