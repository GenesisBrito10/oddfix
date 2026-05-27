import { RedisService } from '../../../../../common/redis/redis.service';
import { InMemoryRedis } from '../../../../../common/redis/__tests__/in-memory-redis.fake';
import { SurebetOpeningProfitCache } from '../surebet-opening-profit-cache.repository';

describe('SurebetOpeningProfitCache', () => {
  let redis: InMemoryRedis;
  let cache: SurebetOpeningProfitCache;

  beforeEach(() => {
    redis = new InMemoryRedis();
    cache = new SurebetOpeningProfitCache(redis as unknown as RedisService);
  });

  it('stores and returns currentPercent on first sight', async () => {
    const value = await cache.getOrSetOpeningProfit('LIVE', 'arb-1', 5.5, 600);
    expect(value).toBe(5.5);
    expect(redis.store.get('surebets:first-seen-profit:live:arb-1')).toBe(
      '5.5',
    );
  });

  it('returns the first value seen on subsequent calls', async () => {
    await cache.getOrSetOpeningProfit('LIVE', 'arb-1', 5.5, 600);
    const value = await cache.getOrSetOpeningProfit('LIVE', 'arb-1', 3.2, 600);
    expect(value).toBe(5.5);
  });

  it('builds the key by type and arbHash', async () => {
    await cache.getOrSetOpeningProfit('PREMATCH', 'abc', 1.1, 3600);
    expect(redis.store.has('surebets:first-seen-profit:prematch:abc')).toBe(
      true,
    );
    expect(await cache.getOpeningProfit('PREMATCH', 'abc')).toBe(1.1);
  });
});
