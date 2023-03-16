import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache, CachingConfig } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  get<T>(key: string) {
    return this.cache.get<T>(key);
  }

  async set<T>(key: string, value: T, options?: CachingConfig) {
    await this.cache.set(key, value, options);
  }

  async delete(key: string) {
    await this.cache.del(key);
  }
}
