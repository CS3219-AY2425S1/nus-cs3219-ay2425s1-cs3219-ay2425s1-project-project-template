import {IsArray, IsEmail, IsEnum, IsOptional, IsString, IsNotEmpty} from 'class-validator';
import { Languages, Proficiency } from 'src/schema/user.schema';

export class CreateUserDto {
  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  displayName: string;

  @IsEmail()
  @IsNotEmpty()
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
  @IsOptional()
  @IsEnum(Languages, { each: true })
  languages: Languages[];
}