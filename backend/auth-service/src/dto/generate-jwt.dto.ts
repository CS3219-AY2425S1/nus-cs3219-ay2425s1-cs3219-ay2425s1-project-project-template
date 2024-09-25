import { IsEmail, IsNotEmpty } from 'class-validator';

export class GenerateJwtDto {
  @IsNotEmpty()
  id: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
