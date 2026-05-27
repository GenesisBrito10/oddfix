import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { RedisService } from '../../../../common/redis/redis.service';
import { BetburgerLockResult } from '../../application/contracts/betburger-integration';

/**
 * Distributed lock via SET NX PX with a unique token. Release uses a
 * compare-and-delete so an instance never frees another instance's lock.
 * Ensures only one backend instance refreshes BetBurger at a time.
 */
@Injectable()
export class BetburgerDistributedLock {
  constructor(private readonly redis: RedisService) {}

  async acquire(key: string, ttlMs: number): Promise<BetburgerLockResult> {
    const token = randomUUID();
    const acquired = await this.redis.setNx(key, token, ttlMs);
    return acquired ? { acquired: true, token } : { acquired: false };
  }

  release(key: string, token: string): Promise<boolean> {
    return this.redis.releaseIfMatch(key, token);
  }

  async withLock<T>(
    key: string,
    ttlMs: number,
    callback: () => Promise<T>,
  ): Promise<T | null> {
    const { acquired, token } = await this.acquire(key, ttlMs);
    if (!acquired || !token) {
      return null;
    }
    try {
      return await callback();
    } finally {
      await this.release(key, token);
    }
  }
}
