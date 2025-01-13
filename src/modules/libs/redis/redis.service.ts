import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { Environment } from 'src/configs';

@Injectable()
export class RedisService extends Redis {
  constructor() {
    super(`${Environment.REDIS_URL}/1`);
  }
}
