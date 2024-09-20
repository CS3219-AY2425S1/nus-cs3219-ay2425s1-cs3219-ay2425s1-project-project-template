import { IsEmail, IsString, ISNotEmpty } from 'class-validator';

export class SignInDto {
  @IsEmail()
  email: string;

  @IsString()
  @ISNotEmpty()
  password: string;
}