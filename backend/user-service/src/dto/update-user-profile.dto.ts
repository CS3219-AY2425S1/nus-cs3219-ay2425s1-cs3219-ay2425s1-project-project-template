import {IsOptional, IsString} from 'class-validator';

export class UpdateUserProfileDto {
  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  displayName: string;
}