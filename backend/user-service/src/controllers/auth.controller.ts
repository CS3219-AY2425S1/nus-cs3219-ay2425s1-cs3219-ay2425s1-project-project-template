import { compare, hash } from 'bcrypt'
import { Request, Response } from 'express'
import { IVerifyOptions } from 'passport-local'
import { findOneUserByEmail, findOneUserByUsername } from '../models/user.repository'
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
    response.status(201).json(user).send()
}

export async function comparePasswords(plaintextPassword: string, hashedPassword: string): Promise<boolean> {
    return compare(plaintextPassword, hashedPassword)
}

export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10
    return hash(password, saltRounds)
}
