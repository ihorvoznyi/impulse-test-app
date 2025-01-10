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

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('Impulse_API');

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

  await app.listen(Environment.HTTP_PORT, Environment.HTTP_HOST);

  logger.log(`http server running on ${await app.getUrl()}`);
}

bootstrap();

// -- generic API response
// -- on success | just a regular response
// -- -- timestamp, data
// -- on error | onThrow, onValidation or uncaughtErrors
// -- -- timestamp, error: { 4XX, 5XX, message: string | string[] }
