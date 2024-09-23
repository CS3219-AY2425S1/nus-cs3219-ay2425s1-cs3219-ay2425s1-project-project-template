import { Type } from 'class-transformer';
import { IsArray, IsIn, IsString } from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  @IsIn(['Easy', 'Medium', 'Hard'])
  difficulty: string;

  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  categories: string[];
}
