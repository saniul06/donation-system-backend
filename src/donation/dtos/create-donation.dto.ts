import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDonationDto {
  @ApiProperty({
    required: true,
    description: 'Donation category',
    example: 'যাকাত তহবিল',
  })
  @IsString()
  category: string;

  @ApiProperty({
    required: true,
    description: 'Donation price',
    example: '1000',
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    required: true,
    description: 'Contact info of donor',
    example: 'email or phone',
  })
  @IsString()
  contact: string;

  @IsOptional()
  @IsNumber()
  userId?: number;
}
