import { ThrottlerModule as tm } from '@nestjs/throttler';

export const ThrottlerModule = tm.forRoot({
  ttl: 5,
  limit: 3,
});
