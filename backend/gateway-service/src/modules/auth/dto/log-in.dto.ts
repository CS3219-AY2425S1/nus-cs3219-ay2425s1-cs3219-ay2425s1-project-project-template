import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { IUser } from '../../interfaces/user/user.interface';

export class LogInDto {
  @ApiProperty({
    example: 'test@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password123',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LogInResponseDto {
  @ApiProperty({ example: 'user_login_sucess' })
  message: string;

  @ApiProperty({
    example: {
      token: 'example_token',
      user: {
        _id: '60f1b3b3b3b3b3b3b3b3b3b3',
        email: 'test@example.com',
        username: 'example_user',
        displayName: 'example_display_name',
        profilePictureUrl: 'https://example.com/profile.jpg',
        proficiency: 'Beginner',
        languages: ['Python', 'Java'],
      },
    },
  })
  data: {
    token: string;
    user: IUser;
  };

  @ApiProperty({ example: null, nullable: true })
  errors: { [key: string]: any };
}
