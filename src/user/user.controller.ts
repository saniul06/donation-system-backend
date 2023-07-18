import {
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CurrentUserDto, UserListDto } from './dtos/user.dto';
import { AdminGuard } from '../guards/admin.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private userService: UserService) {}

  @UseGuards(AdminGuard)
  @Serialize(UserListDto)
  @Get('/')
  async getAllUser() {
    try {
      this.logger.log('Fetch all user request');
      const userList = await this.userService.findAll();
      return { userList };
    } catch (err) {
      this.logger.error(
        'Fetch all user request failed with error: ',
        err.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  @Serialize(CurrentUserDto)
  @Get('/me')
  getProfile(@CurrentUser() user: User) {
    try {
      this.logger.log('User profile fetch request');
      return { user };
    } catch (err) {
      this.logger.log(
        `User profile fetch request failed with error ${err.stack}`,
      );
      if (err?.statu) throw err;
      throw new InternalServerErrorException();
    }
  }
}
