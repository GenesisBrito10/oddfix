/**
 * In-memory stand-in for RedisService used by unit tests. Implements only the
 * methods the cache/lock/rate-limiter/status services use. Cast with
 * `as unknown as RedisService` at the call site.
 */
export class InMemoryRedis {
  readonly store = new Map<string, string>();
  readonly expires = new Map<string, number>();

  get(key: string): Promise<string | null> {
    return Promise.resolve(this.store.has(key) ? this.store.get(key)! : null);
  }

  set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    this.store.set(key, value);
    if (ttlSeconds && ttlSeconds > 0) {
      this.expires.set(key, ttlSeconds);
    }
    return Promise.resolve();
  }

  del(key: string): Promise<number> {
    const existed = this.store.delete(key);
    this.expires.delete(key);
    return Promise.resolve(existed ? 1 : 0);
  }

  incr(key: string): Promise<number> {
    const next = Number(this.store.get(key) ?? '0') + 1;
    this.store.set(key, String(next));
    return Promise.resolve(next);
  }

  expire(key: string, seconds: number): Promise<void> {
    this.expires.set(key, seconds);
    return Promise.resolve();
  }

  setNx(key: string, value: string, ttlMs: number): Promise<boolean> {
    if (this.store.has(key)) {
      return Promise.resolve(false);
    }
    this.store.set(key, value);
    this.expires.set(key, Math.round(ttlMs / 1000));
    return Promise.resolve(true);
  }

  releaseIfMatch(key: string, token: string): Promise<boolean> {
    if (this.store.get(key) === token) {
      this.store.delete(key);
      this.expires.delete(key);
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }
}
