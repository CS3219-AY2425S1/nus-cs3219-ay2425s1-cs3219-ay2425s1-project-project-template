import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, ValidationError, validate } from 'class-validator'

import { Proficiency } from './Proficiency'
import { TypedRequest } from './TypedRequest'

export class UserProfileDto {
    @IsString()
    @IsNotEmpty()
    username: string

    @IsDate()
    updatedAt: Date

    @IsOptional()
    @IsEnum(Proficiency)
    proficiency?: Proficiency

    constructor(username: string, updatedAt: Date, proficiency?: Proficiency) {
        this.username = username
        this.updatedAt = updatedAt
        this.proficiency = proficiency
    }

    static fromRequest({ body: { username, proficiency } }: TypedRequest<UserProfileDto>): UserProfileDto {
        return new UserProfileDto(username, new Date(), proficiency)
    }

    async validate(): Promise<ValidationError[]> {
        return validate(this)
    }
}
