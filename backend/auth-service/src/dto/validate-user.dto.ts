import { IsNotEmpty } from 'class-validator';

export class ValidateUserDto {
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  hashedPassword: string;
}
