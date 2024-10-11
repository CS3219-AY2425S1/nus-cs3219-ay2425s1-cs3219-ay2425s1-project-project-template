import { ITypedBodyRequest } from '@repo/request-types'
import { Category, Complexity, Proficiency } from '@repo/user-types'
import { IsEnum, IsNotEmpty, IsString, ValidationError, validate } from 'class-validator'

export class UserQueueRequestDto {
    @IsEnum(Proficiency)
    @IsNotEmpty()
    proficiency: Proficiency

    @IsEnum(Complexity)
    @IsNotEmpty()
    difficulty: Complexity

    @IsEnum(Category)
    @IsNotEmpty()
    topic: Category

    @IsString()
    @IsNotEmpty()
    userId: string

    constructor(proficiency: Proficiency, difficulty: Complexity, topic: Category, userId: string) {
        this.proficiency = proficiency
        this.difficulty = difficulty
        this.topic = topic
        this.userId = userId
    }

    static fromRequest({
        body: { proficiency, difficulty, topic, userId },
    }: ITypedBodyRequest<UserQueueRequestDto>): UserQueueRequestDto {
        return new UserQueueRequestDto(proficiency, difficulty, topic, userId)
    }

    async validate(): Promise<ValidationError[]> {
        return validate(this)
    }
}
