import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class MyDonationFetchDto {
  @ApiProperty({
    required: false,
    description:
      'Give the last id of donation list to fetch more donation records',
    example: '20',
  })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  lastId?: number;

  @ApiProperty({
    required: false,
    description: 'Donation id',
    example: '3',
  })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  id?: number;

  @ApiProperty({
    required: false,
    description: 'Donor"s category',
    example: 'জরুরী বন্যা তহবিল',
  })
  @IsString()
  @IsOptional()
  category?: string;
}
