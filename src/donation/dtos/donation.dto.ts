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
  deletedAt: number;

  @Expose()
  @Type(() => UserDto)
  user: UserDto;
}
