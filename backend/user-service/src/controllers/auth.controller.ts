import * as path from 'path'

import { ValidationError } from 'class-validator'
import { Request, Response } from 'express'
import { promises as fs } from 'fs'
import nodemailer from 'nodemailer'
import { generateAccessToken } from '../common/token.util'
import { findOneUserByEmail, updateUser } from '../models/user.repository'
import { EmailVerificationDto } from '../types/EmailVerificationDto'
import { TypedRequest } from '../types/TypedRequest'
import { UserDto } from '../types/UserDto'

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
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASSWORD,
        },
    })
    await transporter.sendMail({
        from: process.env.NODEMAILER_EMAIL,
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
    createDto.verificationToken = '0'
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
    if (user.verificationToken !== '0') {
        response.status(400).json('TOKEN_ALREADY_SENT').send()
        return
    }

    const otp = generateOTP()
    createDto.verificationToken = otp

    await updateUser(user.id, createDto)

    const htmlFile = await getHTMLTemplate('../../public/passwordResetEmail.html')
    await sendMail(user.email, 'Password Reset Request', 'PeerPrep', htmlFile.replace('{otp}', otp))

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

    if (user.verificationToken == '0' || user.verificationToken !== createDto.verificationToken) {
        response.status(400).json('INVALID_OTP').send()
        return
    }

    createDto.verificationToken = '0'
    await updateUser(user.id, createDto)

    response.status(200).send()
}
