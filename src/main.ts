import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('Impulse_API');

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.http.port');
  const host = configService.get<string>('app.http.host');
  const cookieSecret = configService.get<string>('auth.cookie.secret');

  app.use(helmet());
  app.use(cookieParser(cookieSecret));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(port, host);

  logger.log(`http server running on ${await app.getUrl()}`);
}

bootstrap();
