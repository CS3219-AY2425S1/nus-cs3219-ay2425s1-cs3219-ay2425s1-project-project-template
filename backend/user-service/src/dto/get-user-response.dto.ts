import { IsEmail, IsEnum, IsString, IsArray } from 'class-validator';
import { Languages, Proficiency } from 'src/schema/user.schema';

export class GetUserResponseDto {
  @IsString()
  _id: string;

  @IsString()
  username: string;

  @IsString()
  displayName: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  profilePictureUrl: string;

  @IsString()
  @IsEnum(Proficiency)
  proficiency: string;

  @IsArray()
  @IsEnum(Languages, { each: true })
  languages: string[];
}
