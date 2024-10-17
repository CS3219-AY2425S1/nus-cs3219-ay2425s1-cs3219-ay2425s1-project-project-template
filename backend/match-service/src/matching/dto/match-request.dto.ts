import { IsNotEmpty, IsString } from 'class-validator';

export class MatchRequestDTO {
  @IsNotEmpty()
  @IsString()
  topic: string;

  @IsNotEmpty()
  @IsString()
  difficulty: string;

  @IsNotEmpty()
  @IsString()
  userId: string;
}
