import { IsNotEmpty, IsString, IsDate, IsMongoId } from 'class-validator';

export class CreateQuestionHistoryDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: string;

  @IsMongoId()
  @IsNotEmpty()
  questionId: string;

  @IsDate()
  @IsNotEmpty()
  attemptDate: Date;

  @IsString()
  @IsNotEmpty()
  attemptDetails: string;
}