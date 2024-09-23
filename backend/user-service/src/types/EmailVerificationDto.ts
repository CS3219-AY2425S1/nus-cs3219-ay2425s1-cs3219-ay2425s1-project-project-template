import { IsDate, IsEmail, IsNotEmpty, IsNumberString, ValidationError, validate } from 'class-validator'

import { TypedRequest } from './TypedRequest'

export class EmailVerificationDto {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsNumberString()
    verificationToken?: string

    @IsDate()
    updatedAt: Date

    constructor(email: string, verificationToken?: string) {
        this.email = email
        this.verificationToken = verificationToken
        this.updatedAt = new Date()
    }

    static fromRequest({
        body: { email, verificationToken },
    }: TypedRequest<EmailVerificationDto>): EmailVerificationDto {
        return new EmailVerificationDto(email, verificationToken)
    }

    async validate(): Promise<ValidationError[]> {
        return validate(this)
    }
}
