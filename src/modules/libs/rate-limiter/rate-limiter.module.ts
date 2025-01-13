import { Global, Module } from '@nestjs/common';
import { RedisService } from '../redis';
import { RateLimitService } from './rate-limiter.service';

@Global()
@Module({
  providers: [RedisService, RateLimitService],
  exports: [RateLimitService],
})
export class RateLimitModule {}
