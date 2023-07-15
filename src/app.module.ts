import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.env.NODE_ENV}.env`,
    }),
    WinstonModule.forRoot({
      level: 'info', // Log level
      format: winston.format.combine(
        winston.format.colorize(), // Add colors
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
        winston.format.printf(({ level, message, timestamp }) => {
          return `\x1b[32m[${timestamp}] \x1b[36m${level}: \x1b[0m${message}`; // Format message with colors
        }),
      ),
      transports: [new winston.transports.Console()],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      username: 'postgres',
      password: 'aaaaaa',
      database: 'donation',
      entities: ['dist/**/*.entity.js'],
      migrations: ['dist/db/migrations/*.js'],
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
