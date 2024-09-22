import { SignOptions, sign } from 'jsonwebtoken'
import config from '../common/config.util'
import { IAccessTokenPayload } from '../types/IAccessTokenPayload'
import { Role } from '../types/Role'
import { UserDto } from '../types/UserDto'

export async function generateAccessToken(user: UserDto): Promise<string> {
    const payload: Partial<IAccessTokenPayload> = {
        id: user.id,
        admin: user.role === Role.ADMIN,
    }
    const options: SignOptions = {
        subject: user.email,
        algorithm: 'RS256', // Assymetric Algorithm
        expiresIn: '1h',
        issuer: 'user-service',
        audience: 'frontend',
    }

    const privateKey: Buffer = Buffer.from(config.ACCESS_TOKEN_PRIVATE_KEY, 'base64')

    return sign(payload, privateKey, options)
}
