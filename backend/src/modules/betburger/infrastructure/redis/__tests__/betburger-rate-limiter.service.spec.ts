import type { ConfigType } from '@nestjs/config';
import betburgerConfig from '../../../../../common/config/betburger.config';
import { RedisService } from '../../../../../common/redis/redis.service';
import { InMemoryRedis } from '../../../../../common/redis/__tests__/in-memory-redis.fake';
import { BetburgerRateLimiter } from '../betburger-rate-limiter.service';

const fakeConfig = {
  liveLimitPerHour: 2,
  prematchLimitPerHour: 1,
} as unknown as ConfigType<typeof betburgerConfig>;

describe('BetburgerRateLimiter', () => {
  let redis: InMemoryRedis;
  let limiter: BetburgerRateLimiter;

  beforeEach(() => {
    redis = new InMemoryRedis();
    limiter = new BetburgerRateLimiter(
      redis as unknown as RedisService,
      fakeConfig,
    );
  });

  it('allows while at/below the limit and blocks above it', async () => {
    const first = await limiter.consume('LIVE');
    const second = await limiter.consume('LIVE');
    const third = await limiter.consume('LIVE');

    expect(first.allowed).toBe(true);
    expect(first.current).toBe(1);
    expect(second.allowed).toBe(true);
    expect(third.allowed).toBe(false);
    expect(third.current).toBe(3);
    expect(third.limit).toBe(2);
  });

  it('applies expire on the first consume of the window', async () => {
    await limiter.consume('LIVE');
    expect(redis.expires.has(limiter.getKey('LIVE'))).toBe(true);
  });

  it('uses separate keys for live and prematch', async () => {
    await limiter.consume('LIVE');
    await limiter.consume('PREMATCH');
    expect(redis.store.has(limiter.getKey('LIVE'))).toBe(true);
    expect(redis.store.has(limiter.getKey('PREMATCH'))).toBe(true);
    expect(limiter.getKey('LIVE')).not.toBe(limiter.getKey('PREMATCH'));
  });

  it('resetAt points to the top of the next hour', async () => {
    const { resetAt } = await limiter.consume('LIVE');
    expect(resetAt.getUTCMinutes()).toBe(0);
    expect(resetAt.getUTCSeconds()).toBe(0);
    expect(resetAt.getTime()).toBeGreaterThan(Date.now());
  });
});
