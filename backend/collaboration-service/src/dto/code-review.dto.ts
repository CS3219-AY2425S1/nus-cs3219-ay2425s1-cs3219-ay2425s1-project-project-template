import { IsNotEmpty, IsString } from 'class-validator';

export class CodeReviewDto {
  @IsString()
  @IsNotEmpty()
  questionId: string

  @IsString()
  @IsNotEmpty()
  code: string;
}
