import * as path from 'path'

import { Request, Response } from 'express'
import { SignOptions, sign } from 'jsonwebtoken'
import { compare, hash } from 'bcrypt'
import { findOneUserByEmail, findOneUserByUsername, updateUser } from '../models/user.repository'

import { EmailVerificationDto } from '../types/EmailVerificationDto'
import { IAccessTokenPayload } from '../types/IAccessTokenPayload'
import { IVerifyOptions } from 'passport-local'
import { Role } from '../types/Role'
import { TypedRequest } from '../types/TypedRequest'
import { UserDto } from '../types/UserDto'
import { ValidationError } from 'class-validator'
import config from '../common/config.util'
import { promises as fs } from 'fs'
import nodemailer from 'nodemailer'

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

export async function getHTMLTemplate(htmlFilePath: string): Promise<string> {
    const filePath = path.join(__dirname, htmlFilePath)
    return await fs.readFile(filePath, 'utf8')
}

export async function sendMail(to: string, subject: string, text: string, html: string): Promise<void> {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    })
    await transporter.sendMail({
        from: process.env.EMAIL,
        to,
        subject,
        text,
        html,
    })
}

export function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function handleReset(request: TypedRequest<EmailVerificationDto>, response: Response): Promise<void> {
    const createDto = EmailVerificationDto.fromRequest(request)
    createDto.verificationToken = ''
    const errors = await createDto.validate()
    if (errors.length) {
        const errorMessages = errors.map((error: ValidationError) => `INVALID_${error.property.toUpperCase()}`)
        response.status(400).json(errorMessages).send()
        return
    }

    const user = await findOneUserByEmail(createDto.email)

    if (!user) {
        response.status(404).json('USER_NOT_FOUND').send()
        return
    }
    if (user.verificationToken === '') {
        response.status(400).json('TOKEN_ALREADY_SENT').send()
        return
    }

    const otp = generateOTP()
    createDto.verificationToken = otp

    await updateUser(user.id, createDto)

    const htmlFile = await getHTMLTemplate('../util/passwordResetEmail.html')
    await sendMail('shishdoescs@gmail.com', 'Password Reset Request', 'PeerPrep', htmlFile.replace('{otp}', otp))

    response.status(200).send()
}

export async function handleVerify(request: TypedRequest<EmailVerificationDto>, response: Response): Promise<void> {
    const createDto = EmailVerificationDto.fromRequest(request)
    const errors = await createDto.validate()
    if (errors.length) {
        const errorMessages = errors.map((error: ValidationError) => `INVALID_${error.property.toUpperCase()}`)
        response.status(400).json(errorMessages).send()
        return
    }

    const user = await findOneUserByEmail(createDto.email)

    if (!user) {
        response.status(404).json('USER_NOT_FOUND').send()
        return
    }

    if (user.verificationToken !== '' && user.verificationToken !== createDto.verificationToken) {
        response.status(400).json('INVALID_OTP').send()
        return
    }

    createDto.verificationToken = ''
    await updateUser(user.id, createDto)
    response.status(200).send()
}
