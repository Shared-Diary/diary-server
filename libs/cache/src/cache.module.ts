import { Module, CacheModule as Cache } from '@nestjs/common';
import { CacheService } from './cache.service';

@Module({
  imports: [Cache.register()],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
