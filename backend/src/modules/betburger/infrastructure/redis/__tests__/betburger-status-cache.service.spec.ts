import { RedisService } from '../../../../../common/redis/redis.service';
import { InMemoryRedis } from '../../../../../common/redis/__tests__/in-memory-redis.fake';
import { BetburgerStatusCache } from '../betburger-status-cache.service';

describe('BetburgerStatusCache', () => {
  let redis: InMemoryRedis;
  let cache: BetburgerStatusCache;

  beforeEach(() => {
    redis = new InMemoryRedis();
    cache = new BetburgerStatusCache(redis as unknown as RedisService);
  });

  it('marks refreshing', async () => {
    await cache.markRefreshing('LIVE');
    const status = await cache.getStatus('LIVE');
    expect(status?.status).toBe('REFRESHING');
    expect(status?.type).toBe('LIVE');
  });

  it('marks success with snapshotId and timestamp', async () => {
    await cache.markSuccess('LIVE', 'live-999');
    const status = await cache.getStatus('LIVE');
    expect(status?.status).toBe('SUCCESS');
    expect(status?.lastSnapshotId).toBe('live-999');
    expect(status?.lastSuccessAt).not.toBeNull();
  });

  it('marks error and sanitizes the access_token from the message', async () => {
    await cache.markError(
      'PREMATCH',
      'request access_token=SUPERSECRET failed',
    );
    const status = await cache.getStatus('PREMATCH');
    expect(status?.status).toBe('ERROR');
    expect(status?.message).toContain('access_token=***');
    expect(status?.message).not.toContain('SUPERSECRET');
    expect(status?.lastErrorAt).not.toBeNull();
  });

  it('marks rate limited with nextAttemptAt', async () => {
    const next = new Date('2026-05-24T04:00:00.000Z');
    await cache.markRateLimited('LIVE', next);
    const status = await cache.getStatus('LIVE');
    expect(status?.status).toBe('RATE_LIMITED');
    expect(status?.nextAttemptAt).toBe('2026-05-24T04:00:00.000Z');
  });

  it('returns null on corrupted JSON', async () => {
    redis.store.set('betburger:status:live', 'not-json');
    expect(await cache.getStatus('LIVE')).toBeNull();
  });
});
