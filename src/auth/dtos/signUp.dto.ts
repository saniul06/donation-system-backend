import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../../types/user.types';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
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

  @ApiProperty({
    required: true,
    description: 'User"s name',
    example: 'akash',
  })
  @IsString()
  username: string;

  @IsOptional()
  @IsEnum(UserRole)
  @IsString()
  role!: UserRole;
}
