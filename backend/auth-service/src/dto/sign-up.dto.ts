import { IsEmail, IsString, IsNotEmpty, IsMinLength } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsMinLength(6)
  @IsString()
  password: string;
}