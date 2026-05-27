import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../../../../common/redis/redis.service';
import {
  NormalizedSurebetSnapshot,
  SurebetType,
} from '../../application/contracts/normalized-surebet-snapshot';

/** Holds the latest normalized snapshot per type at `surebets:current:{type}`. */
@Injectable()
export class CurrentSurebetsCacheRepository {
  private readonly logger = new Logger(CurrentSurebetsCacheRepository.name);

  constructor(private readonly redis: RedisService) {}

  private key(type: SurebetType): string {
    return `surebets:current:${type.toLowerCase()}`;
  }

  async setCurrentSnapshot(
    type: SurebetType,
    snapshot: NormalizedSurebetSnapshot,
    ttlSeconds: number,
  ): Promise<void> {
    await this.redis.set(this.key(type), JSON.stringify(snapshot), ttlSeconds);
  }

  async getCurrentSnapshot(
    type: SurebetType,
  ): Promise<NormalizedSurebetSnapshot | null> {
    const raw = await this.redis.get(this.key(type));
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as NormalizedSurebetSnapshot;
    } catch {
      this.logger.warn(`Corrupted current snapshot JSON for ${type}`);
      return null;
    }
  }

  async deleteCurrentSnapshot(type: SurebetType): Promise<void> {
    await this.redis.del(this.key(type));
  }
}
