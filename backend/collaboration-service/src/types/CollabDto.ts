import { ITypedBodyRequest } from '@repo/request-types'
import {
    ArrayNotEmpty,
    IsArray,
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsString,
    validate,
    ValidateNested,
    ValidationError,
} from 'class-validator'
import { Type } from 'class-transformer'
import { LanguageMode } from './LanguageMode'
import { ChatModel } from '.'

export class CollabDto {
    @IsString()
    @IsNotEmpty()
    questionId: string

    @IsEnum(LanguageMode)
    @IsNotEmpty()
    language: LanguageMode

    @IsString()
    @IsNotEmpty()
    code: string

    @IsString()
    @IsNotEmpty()
    executionResult: string

    @IsArray()
    @ArrayNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => ChatModel)
    chatHistory: ChatModel[]

    @IsDate()
    @IsNotEmpty()
    createdAt: Date

    constructor(
        language: LanguageMode,
        code: string,
        executionResult: string,
        chatHistory: ChatModel[],
        createdAt: Date
    ) {
        this.language = language
        this.code = code
        this.executionResult = executionResult
        this.chatHistory = chatHistory
        this.createdAt = createdAt
    }

    static fromRequest({
        body: { language, code, executionResult, chatHistory, createdAt },
    }: ITypedBodyRequest<CollabDto>): CollabDto {
        return new CollabDto(language, code, executionResult, chatHistory, createdAt)
    }

    async validate(): Promise<ValidationError[]> {
        return validate(this)
    }
}
