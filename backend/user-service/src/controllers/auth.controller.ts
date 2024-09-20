import { compare, hash } from 'bcrypt'
import { Request, Response } from 'express'
import { sign, SignOptions } from 'jsonwebtoken'
import { IVerifyOptions } from 'passport-local'
import config from '../common/config.util'
import { findOneUserByEmail, findOneUserByUsername } from '../models/user.repository'
import { IAccessTokenPayload } from '../types/IAccessTokenPayload'
import { Role } from '../types/Role'
import { UserDto } from '../types/UserDto'

export async function handleAuthentication(
    usernameOrEmail: string,
    password: string,
    done: (error: Error | null, user: UserDto | false, options?: IVerifyOptions) => void
): Promise<void> {
    const user = (await findOneUserByUsername(usernameOrEmail)) || (await findOneUserByEmail(usernameOrEmail))
    if (!user) {
        done(null, false)
        return
    }

    const isPasswordMatching = await compare(password, user.password)
    if (!isPasswordMatching) {
        done(null, false)
        return
    }

    const dto = UserDto.fromModel(user)

    done(null, dto)
}

export async function handleLogin({ user }: Request, response: Response): Promise<void> {
    const accessToken = await generateAccessToken(user as UserDto)
    response
        .status(201)
        .json({
            ...user,
            accessToken,
        })
        .send()
}

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

export async function comparePasswords(plaintextPassword: string, hashedPassword: string): Promise<boolean> {
    return compare(plaintextPassword, hashedPassword)
}

export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10
    return hash(password, saltRounds)
}
