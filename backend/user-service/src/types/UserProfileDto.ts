import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, ValidationError, validate } from 'class-validator'

import { Proficiency } from './Proficiency'
import { TypedRequest } from './TypedRequest'

export class UserProfileDto {
    @IsString()
    @IsNotEmpty()
    id: string

    @IsString()
    @IsNotEmpty()
    username: string

    @IsDate()
    updatedAt: Date

    @IsOptional()
    @IsEnum(Proficiency)
    proficiency?: Proficiency

    constructor(id: string, username: string, updatedAt: Date, proficiency?: Proficiency) {
        this.id = id
        this.username = username
        this.updatedAt = updatedAt
        this.proficiency = proficiency
    }

    static fromRequest({ body: { id, username, proficiency } }: TypedRequest<UserProfileDto>): UserProfileDto {
        return new UserProfileDto(id, username, new Date(), proficiency)
    }

    async validate(): Promise<ValidationError[]> {
        return validate(this)
    }
}
