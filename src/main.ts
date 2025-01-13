import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';

import { AppModule } from './app';
import {
  HttpStatus,
  INestApplication,
  Logger,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';

import { Environment } from './configs';
import { GlobalExceptionFilter } from './app/filters';
import { ValidationError } from 'class-validator';
import { setupSwagger } from './swagger';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { RedisService } from './modules/libs/redis';
import { CampaignReportController } from './modules/campaign-report/controllers';

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

export const initializeRateLimitClient = (
  app: INestApplication,
  max = Environment.RATE_LIMIT_MAX,
  windowMs = Environment.RATE_LIMIT_WINDOW_MS,
) => {
  const redis = app.get(RedisService);
  const rateLimiter = rateLimit({
    max,
    windowMs,
    store: new RedisStore({
      // @ts-expect-error: rate-limit-redis types are incorrect
      sendCommand: async (...args: string[]) => redis.call(...args),
    }),
  });

  app.use(CampaignReportController, rateLimiter);
};

bootstrap();
