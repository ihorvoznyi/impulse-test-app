import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../redis';

@Injectable()
export class RateLimitService {
  private readonly logger = new Logger(RateLimitService.name);

  constructor(private readonly redisService: RedisService) {}

  public async isRateLimited(
    key: string,
    limit: number,
    ttl: number,
  ): Promise<boolean> {
    const currentCount = await this.redisService.incr(key);
    if (currentCount === 1) {
      // Set expiration for the first request
      await this.redisService.expire(key, ttl);
    }

    this.logger.log(key, currentCount);

    return currentCount > limit;
  }

  public async getRemainingRequestsCount(key: string, limit: number) {
    const currentCount = await this.redisService.get(key);
    return limit - (Number(currentCount) || 0);
  }
}
