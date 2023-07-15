import {
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private userService: UserService) {}

  @Get('/')
  async getAllUser() {
    try {
      this.logger.log('Fetch all user request');
      return await this.userService.findAll();
    } catch (err) {
      this.logger.error(
        'Fetch all user request failed with error: ',
        err.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
