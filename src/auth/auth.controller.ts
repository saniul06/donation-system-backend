import {
  Body,
  Controller,
  InternalServerErrorException,
  Logger,
  Post,
} from '@nestjs/common';
import { SignUpDto } from './dtos/signUp.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/singIn.dto';
import { Public } from '../decorators/public.decorator';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  async signup(@Body() signUpDto: SignUpDto) {
    try {
      this.logger.log('SignUp request');
      await this.authService.signup(signUpDto);
      return { success: true, message: 'Signup successful' };
    } catch (err) {
      this.logger.error(`Singup request failed with error: ${err.stack}`);
      if (err?.status) throw err;
      throw new InternalServerErrorException();
    }
  }

  @Public()
  @Post('signin')
  async signin(@Body() signInDto: SignInDto) {
    try {
      this.logger.log('Signin request');
      const { userData, accessToken } = await this.authService.signin(
        signInDto,
      );
      return {
        success: true,
        message: 'Signin successful',
        user: userData,
        token: `Bearer ${accessToken}`,
      };
    } catch (err) {
      this.logger.error(`Signin request failed with error: ${err.stack}`);
      if (err?.status) throw err;
      throw new InternalServerErrorException();
    }
  }
}
