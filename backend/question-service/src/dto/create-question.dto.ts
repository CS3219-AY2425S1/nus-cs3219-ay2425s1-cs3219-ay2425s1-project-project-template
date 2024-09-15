import { PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { QuestionComplexity, QuestionTopics } from '../schemas/question.schema';

export class CreateQuestionDto {
    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsString()
    @IsNotEmpty()
    readonly description: string;

    @IsEnum(QuestionTopics, { each: true })
    readonly topics: QuestionTopics[];

    @IsEnum(QuestionComplexity)
    readonly complexity: QuestionComplexity;

    @IsString()
    @IsNotEmpty()
    readonly link: string;
}

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {}