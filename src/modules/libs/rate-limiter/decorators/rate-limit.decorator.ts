import { SetMetadata } from '@nestjs/common';

export const RATE_LIMIT_OPTIONS_KEY = 'rateLimit';

export interface IRateLimitOptions {
  ttl: number;
  limit: number;
}

export const SetRateLimit = (limit: number, ttl: number) =>
  SetMetadata<string, IRateLimitOptions>(RATE_LIMIT_OPTIONS_KEY, {
    limit,
    ttl,
  });
