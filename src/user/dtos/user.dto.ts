import { Expose, Type } from 'class-transformer';

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  role: string;
}

export class CurrentUserDto {
  @Expose()
  @Type(() => UserDto)
  user: UserDto;
}

export class UserListDto {
  @Expose()
  @Type(() => UserDto)
  userList: UserDto;
}
