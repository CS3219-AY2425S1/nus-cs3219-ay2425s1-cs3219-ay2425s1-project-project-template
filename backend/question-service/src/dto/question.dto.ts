import { PartialType } from '@nestjs/swagger';
import { IsArray, IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { QuestionComplexity, QuestionTopic } from '../schemas/question.schema';
import { Optional } from '@nestjs/common';

export class CreateQuestionDto {
    @IsString()
    @IsNotEmpty()
    readonly title: string;

    @IsString()
    @IsNotEmpty()
    readonly description: string;

    @IsEnum(QuestionTopic, { each: true })
    readonly topics: QuestionTopic[];

    @IsEnum(QuestionComplexity)
    readonly complexity: QuestionComplexity;

    @IsString()
    @IsNotEmpty()
    readonly link: string;
}

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {}

export class FilterQuestionsDto {
    @IsEnum(QuestionComplexity)
    @IsOptional() 
    difficulty?: QuestionComplexity;
  
    @IsArray()
    @Optional()  
    @IsEnum(QuestionTopic, { each: true })  
    topics: QuestionTopic[];
}