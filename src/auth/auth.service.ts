import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(signUpData: Partial<User>) {
    const { email, password, username, role } = signUpData;
    const user = await this.userService.findOneBy({ email });
    if (user) {
      throw new BadRequestException('Email already in use');
    }
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const hashedPassword = salt + '.' + hash.toString('hex');
    const userData: Partial<User> = {
      username,
      email,
      password: hashedPassword,
    };
    if (role) userData.role = role;
    return this.userService.create(userData);
  }

  async signin(signInData: { email: string; password: string }) {
    const user = await this.userService.findOneBy({ email: signInData.email });
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }
    const { id, email, username, role, password: userPassword } = user;
    const [salt, hashedPassword] = userPassword.split('.');
    const hash = (await scrypt(signInData.password, salt, 32)) as Buffer;
    if (hash.toString('hex') !== hashedPassword) {
      throw new BadRequestException('Invalid email or password');
    }

    const userData = { id, email, username, role };
    const accessToken = await this.jwtService.signAsync(userData);
    return { accessToken, userData };
  }
}
