import {IsArray, IsEmail, IsEnum, IsOptional, IsString, IsNotEmpty} from 'class-validator';
import { Languages, Proficiency } from 'src/schema/user.schema';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  displayName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsString()
  profilePictureUrl?: string;

  @IsOptional()
  @IsEnum(Proficiency)
  proficiency?: Proficiency;

  @IsArray()
  @IsEnum(Languages, { each: true })
  languages: Languages[];
}