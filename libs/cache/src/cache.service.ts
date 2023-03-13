import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  get<T>(key: string) {
    return this.cache.get<T>(key);
  }

  set<T>(key: string, value: T, ttl?: number) {
    return this.cache.set(key, value, ttl);
  }

  async delete(key: string) {
    await this.cache.del(key);
  }
}
