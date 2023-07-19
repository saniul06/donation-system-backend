import { Expose, Type } from 'class-transformer';
import { UserDto } from '../../user/dtos/user.dto';

export class DonationDto {
  @Expose()
  id: number;

  @Expose()
  contact: string;

  @Expose()
  category: string;

  @Expose()
  amount: number;

  @Expose()
  createdAt: number;

  @Expose()
  @Type(() => UserDto)
  user: UserDto;
}

export class CreatedDonationDTO {
  @Expose()
  @Type(() => DonationDto)
  createdDonation: DonationDto;

  @Expose()
  success: boolean;

  @Expose()
  message: string;
}

export class UpdatedDonationDTO {
  @Expose()
  @Type(() => DonationDto)
  updatedDonation: DonationDto;

  @Expose()
  success: boolean;

  @Expose()
  message: string;
}

export class AllDonationDto {
  @Expose()
  success: string;

  @Expose()
  @Type(() => DonationDto)
  donationList: DonationDto;
}

export class MyDonationDto {
  @Expose()
  success: string;

  @Expose()
  @Type(() => DonationDto)
  myDonationList: DonationDto;
}
