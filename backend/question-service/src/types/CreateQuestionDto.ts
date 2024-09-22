import { IsArray, IsEnum, IsNotEmpty, IsString, IsUrl, validate, ValidationError } from 'class-validator'
import { Complexity } from './Complexity'
import { TypedRequest } from './TypedRequest'

export class CreateQuestionDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    description: string

    @IsArray()
    @IsString({ each: true })
    categories: string[]

    @IsEnum(Complexity)
    complexity: Complexity

    @IsUrl()
    link: string

    constructor(title: string, description: string, categories: string[], complexity: Complexity, link: string) {
        this.title = title
        this.description = description
        this.categories = categories
        this.complexity = complexity
        this.link = link
    }

    static fromRequest({
        body: { title, description, categories, complexity, link },
    }: TypedRequest<CreateQuestionDto>): CreateQuestionDto {
        return new CreateQuestionDto(title, description, categories, complexity, link)
    }

    async validate(): Promise<ValidationError[]> {
        return validate(this)
    }
}
