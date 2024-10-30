import { IsNotEmpty, IsString, IsDate, IsMongoId, IsArray, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateQuestionHistoryDto {
  @IsMongoId()
  @IsNotEmpty()
  sessionId: string;

  @IsMongoId()
  @IsNotEmpty()
  questionId: string;

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  attemptDate: Date;

  @IsString()
  @IsNotEmpty()
  attemptCode: string;

  @IsArray()
  @IsBoolean({ each: true })
  @IsNotEmpty()
  testCasesPassed: boolean[];
}