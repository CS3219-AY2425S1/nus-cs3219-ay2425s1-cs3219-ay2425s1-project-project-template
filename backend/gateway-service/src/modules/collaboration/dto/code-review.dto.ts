import { IsNotEmpty, IsString } from 'class-validator';

export class CodeReviewDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}