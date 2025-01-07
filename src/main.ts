import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';

import { AppModule } from './app';
import { Logger, ValidationPipe } from '@nestjs/common';

import { Environment } from './configs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('Impulse_API');

  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(Environment.HTTP_PORT, Environment.HTTP_HOST);

  logger.log(`http server running on ${await app.getUrl()}`);
}

bootstrap();
