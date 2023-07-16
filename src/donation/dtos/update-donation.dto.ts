import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateDonationDto {
  @ApiProperty({
    required: false,
    description: 'Donation category',
    example: 'যাকাত তহবিল',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    required: false,
    description: 'Donation price',
    example: '1000',
  })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiProperty({
    required: false,
    description: 'Contact info of donor',
    example: 'email or phone',
  })
  @IsOptional()
  @IsString()
  contact?: string;
}
