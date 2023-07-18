import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Post,
  Res,
} from '@nestjs/common';
import { SignUpDto } from './dtos/signUp.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/singIn.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { Public } from '../decorators/public.decorator';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

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
  async signin(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      this.logger.log('Signin request');
      const { userData, accessToken } = await this.authService.signin(
        signInDto,
      );
      response.cookie(
        this.configService.get<string>('ACCESS_TOKEN_NAME'),
        accessToken,
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
