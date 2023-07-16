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

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    private authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

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

  @Post('signin')
  async signin(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    try {
      this.logger.log('Signin request');
      const accessToken = await this.authService.signin(signInDto);
      response.cookie(
        this.configService.get<string>('ACCESS_TOKEN_NAME'),
        accessToken,
      );
      return { success: true, message: 'Signin successful' };
    } catch (err) {
      this.logger.error(`Signin request failed with error: ${err.stack}`);
      if (err?.status) throw err;
      throw new InternalServerErrorException();
    }
  }

  @Get('signout')
  signout(@Res({ passthrough: true }) response: Response) {
    try {
      this.logger.log('Signout request');
      response.clearCookie(this.configService.get<string>('ACCESS_TOKEN_NAME'));
      return { success: true, message: 'Signout successful' };
    } catch (err) {
      this.logger.error(`Signout request failed with error: ${err.stack}`);
      if (err?.status) throw err;
      throw new InternalServerErrorException();
    }
  }
}
