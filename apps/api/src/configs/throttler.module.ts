import { ThrottlerModule } from '@nestjs/throttler';

export default ThrottlerModule.forRoot({
  ttl: 5,
  limit: 3,
});
