import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    required: true,
    description: 'User"s email',
    example: 'example@e.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    description: 'User"s password',
    example: 'randompassword',
  })
  @IsString()
  password: string;
}
