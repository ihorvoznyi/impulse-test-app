import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  IRateLimitOptions,
  RATE_LIMIT_OPTIONS_KEY,
} from 'src/app/decorators/rate-limit.decorator';
import { RateLimitService } from 'src/modules/libs/rate-limiter';

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly logger = new Logger(RateLimitGuard.name);

  constructor(
    private readonly rateLimiterService: RateLimitService,
    private readonly reflector: Reflector,
  ) {}

  public async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const handler = context.getHandler();
    const controller = context.getClass();

    const rateLimitOptions = this.reflector.get<IRateLimitOptions>(
      RATE_LIMIT_OPTIONS_KEY,
      handler,
    );

    if (!rateLimitOptions?.limit || !rateLimitOptions?.ttl) {
      return true;
    }

    const key = `rate-limit:${controller.name}:${handler.name}:${request.ip}`;
    const isLimited = await this.rateLimiterService.isRateLimited(
      key,
      rateLimitOptions.limit,
      rateLimitOptions.ttl,
    );

    this.logger.log(key, isLimited);

    if (isLimited) {
      throw new HttpException(
        'Too many requests.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
