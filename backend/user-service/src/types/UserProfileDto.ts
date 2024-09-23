import { IsEnum, IsNotEmpty, IsOptional, IsString, ValidationError, validate } from 'class-validator'

import { Proficiency } from './Proficiency'
import { TypedRequest } from './TypedRequest'

export class UserProfileDto {
    @IsString()
    @IsNotEmpty()
    username: string

    @IsOptional()
    @IsEnum(Proficiency)
    proficiency?: Proficiency

    constructor(username: string, proficiency?: Proficiency) {
        this.username = username
        this.proficiency = proficiency
    }

    static fromRequest({ body: { username, proficiency } }: TypedRequest<UserProfileDto>): UserProfileDto {
        return new UserProfileDto(username, proficiency)
    }

    async validate(): Promise<ValidationError[]> {
        return validate(this)
    }
}
