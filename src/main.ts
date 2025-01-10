import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';

import { AppModule } from './app';
import {
  HttpStatus,
  Logger,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';

import { Environment } from './configs';
import { GlobalExceptionFilter } from './app/filters';
import { ValidationError } from 'class-validator';
import { setupSwagger } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger(Environment.APP_NAME);

  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: (errors: ValidationError[]) => {
        throw new UnprocessableEntityException(errors);
      },
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());

  if (Environment.NODE_ENV === 'development') {
    setupSwagger(app);
  }

  await app.listen(Environment.HTTP_PORT, Environment.HTTP_HOST);

  logger.log(`http server running on ${await app.getUrl()}`);
}

bootstrap();
