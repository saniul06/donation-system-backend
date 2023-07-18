import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as morgan from 'morgan';
import * as cors from 'cors';
import helmet from 'helmet';

async function bootstrap() {
  const logger = new Logger('NestApplication');
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });
  // secure app by setting various HTTP headers.
  app.use(helmet());
  // app.use(
  //   cors({
  //     credentials: true,
  //   }),
  // );
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Donation system')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
  app.use(
    morgan(function (tokens, req, res) {
      return [
        new Date().toString().substring(4, 24),
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'),
        '-',
        tokens['response-time'](req, res),
        'ms',
      ].join(' ');
    }),
  );
  const port = process.env.SERVER_PORT || 5000;
  await app.listen(port, () => {
    logger.log(`App started at port ${port}`);
  });
}
bootstrap();
