import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import betburgerConfig from '../../../../common/config/betburger.config';
import { RedisService } from '../../../../common/redis/redis.service';
import {
  BetburgerRateLimitResult,
  BetburgerType,
} from '../../application/contracts/betburger-integration';

/**
 * Hourly per-type request counter (`betburger:rate:{type}:{yyyyMMddHH}`).
 * Uses atomic INCR; must be consumed before any real BetBurger request (Fase 7).
 */
@Injectable()
export class BetburgerRateLimiter {
  constructor(
    private readonly redis: RedisService,
    @Inject(betburgerConfig.KEY)
    private readonly config: ConfigType<typeof betburgerConfig>,
  ) {}

  getKey(type: BetburgerType, date: Date = new Date()): string {
    return `betburger:rate:${type.toLowerCase()}:${this.hourStamp(date)}`;
  }

  async consume(type: BetburgerType): Promise<BetburgerRateLimitResult> {
    const key = this.getKey(type);
    const current = await this.redis.incr(key);
    if (current === 1) {
      // Slightly over an hour so the counter survives until the window rolls.
      await this.redis.expire(key, 3700);
    }
    const limit = this.limitFor(type);
    return {
      allowed: current <= limit,
      current,
      limit,
      resetAt: this.nextHour(),
    };
  }

  async getStatus(
    type: BetburgerType,
  ): Promise<{ current: number; limit: number; resetAt: Date }> {
    const raw = await this.redis.get(this.getKey(type));
    const current = raw ? Number(raw) : 0;
    return {
      current: Number.isFinite(current) ? current : 0,
      limit: this.limitFor(type),
      resetAt: this.nextHour(),
    };
  }

  private limitFor(type: BetburgerType): number {
    return type === 'LIVE'
      ? this.config.liveLimitPerHour
      : this.config.prematchLimitPerHour;
  }

  private hourStamp(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return (
      `${date.getUTCFullYear()}` +
      `${pad(date.getUTCMonth() + 1)}` +
      `${pad(date.getUTCDate())}` +
      `${pad(date.getUTCHours())}`
    );
  }

  private nextHour(): Date {
    const next = new Date();
    next.setUTCMinutes(0, 0, 0);
    next.setUTCHours(next.getUTCHours() + 1);
    return next;
  }
}
