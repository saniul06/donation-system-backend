import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/user.entity';

interface CustomRequest extends Request {
  user: User; // Define the 'user' property type as per your requirements
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async use(req: CustomRequest, res: Response, next: NextFunction) {
    const token = this.extractTokenFromHeader(req);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      req.user = payload;
    } catch {
      throw new UnauthorizedException();
    }

    next();
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const accessToken =
      request.cookies[this.configService.get<string>('ACCESS_TOKEN_NAME')];
    return accessToken ? accessToken : undefined;
  }
}
