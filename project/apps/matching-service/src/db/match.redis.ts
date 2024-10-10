import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class MatchRedis {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  // Contains methods to get and post values to redis
}
