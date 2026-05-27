import { Injectable } from '@nestjs/common';
import { RedisService } from '../../../../common/redis/redis.service';
import { SurebetType } from '../../application/contracts/normalized-surebet-snapshot';

/**
 * Remembers the FIRST percent seen per arbHash
 * (`surebets:first-seen-profit:{type}:{arbHash}`) so live decay can be computed
 * later. getOrSet is atomic via SET NX.
 */
@Injectable()
export class SurebetOpeningProfitCache {
  constructor(private readonly redis: RedisService) {}

  private key(type: SurebetType, arbHash: string): string {
    return `surebets:first-seen-profit:${type.toLowerCase()}:${arbHash}`;
  }

  async getOrSetOpeningProfit(
    type: SurebetType,
    arbHash: string,
    currentPercent: number,
    ttlSeconds: number,
  ): Promise<number> {
    const key = this.key(type, arbHash);
    const wasSet = await this.redis.setNx(
      key,
      String(currentPercent),
      ttlSeconds * 1000,
    );
    if (wasSet) {
      return currentPercent;
    }

    const existing = await this.redis.get(key);
    if (existing == null) {
      return currentPercent;
    }
    const parsed = Number(existing);
    return Number.isFinite(parsed) ? parsed : currentPercent;
  }

  async getOpeningProfit(
    type: SurebetType,
    arbHash: string,
  ): Promise<number | null> {
    const raw = await this.redis.get(this.key(type, arbHash));
    if (raw == null) {
      return null;
    }
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : null;
  }

  async deleteOpeningProfit(type: SurebetType, arbHash: string): Promise<void> {
    await this.redis.del(this.key(type, arbHash));
  }
}
