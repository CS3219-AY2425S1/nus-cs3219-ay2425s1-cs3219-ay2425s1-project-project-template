import { IsStrongPassword, ValidationError, validate } from 'class-validator'

import { TypedRequest } from './TypedRequest'

export class UserPasswordDto {
    @IsStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
    password: string

    constructor(password: string) {
        this.password = password
    }

    static fromRequest({ body: { password } }: TypedRequest<UserPasswordDto>): UserPasswordDto {
        return new UserPasswordDto(password)
    }

    async validate(): Promise<ValidationError[]> {
        return validate(this)
    }
}
