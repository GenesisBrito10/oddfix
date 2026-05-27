import { RedisService } from '../../../../../common/redis/redis.service';
import { InMemoryRedis } from '../../../../../common/redis/__tests__/in-memory-redis.fake';
import { BetburgerDistributedLock } from '../betburger-distributed-lock.service';

const KEY = 'betburger:lock:refresh:live';

describe('BetburgerDistributedLock', () => {
  let redis: InMemoryRedis;
  let lock: BetburgerDistributedLock;

  beforeEach(() => {
    redis = new InMemoryRedis();
    lock = new BetburgerDistributedLock(redis as unknown as RedisService);
  });

  it('acquires a free lock and returns a token', async () => {
    const result = await lock.acquire(KEY, 1000);
    expect(result.acquired).toBe(true);
    expect(result.token).toBeTruthy();
  });

  it('fails to acquire a held lock', async () => {
    await lock.acquire(KEY, 1000);
    const second = await lock.acquire(KEY, 1000);
    expect(second.acquired).toBe(false);
    expect(second.token).toBeUndefined();
  });

  it('releases only with the matching token', async () => {
    const { token } = await lock.acquire(KEY, 1000);
    expect(await lock.release(KEY, 'wrong-token')).toBe(false);
    expect(redis.store.has(KEY)).toBe(true);
    expect(await lock.release(KEY, token as string)).toBe(true);
    expect(redis.store.has(KEY)).toBe(false);
  });

  it('runs the callback only when the lock is acquired and releases it', async () => {
    const result = await lock.withLock(KEY, 1000, () =>
      Promise.resolve('done'),
    );
    expect(result).toBe('done');
    expect(redis.store.has(KEY)).toBe(false);
  });

  it('returns null without running the callback when the lock is held', async () => {
    await lock.acquire(KEY, 1000);
    const callback = jest.fn(() => Promise.resolve('x'));
    const result = await lock.withLock(KEY, 1000, callback);
    expect(result).toBeNull();
    expect(callback).not.toHaveBeenCalled();
  });

  it('releases the lock even if the callback throws', async () => {
    await expect(
      lock.withLock(KEY, 1000, () => Promise.reject(new Error('boom'))),
    ).rejects.toThrow('boom');
    expect(redis.store.has(KEY)).toBe(false);
  });
});
