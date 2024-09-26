import { ITypedBodyRequest } from '@repo/request-types/ITypedBodyRequest'
import { IsEnum, IsNotEmpty, IsOptional, IsString, ValidationError, validate } from 'class-validator'
import { Proficiency } from './Proficiency'

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

    static fromRequest({ body: { username, proficiency } }: ITypedBodyRequest<UserProfileDto>): UserProfileDto {
        return new UserProfileDto(username, proficiency)
    }

    async validate(): Promise<ValidationError[]> {
        return validate(this)
    }
}
