import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../../../../common/redis/redis.service';
import {
  NormalizedSurebetSnapshot,
  SurebetType,
} from '../../application/contracts/normalized-surebet-snapshot';

/**
 * Temporary snapshot store keyed by snapshotId
 * (`surebets:snapshot:{type}:{snapshotId}`). Used later when the user registers
 * a surebet: the backend re-reads this snapshot and finds the arb by arbHash.
 */
@Injectable()
export class SnapshotSurebetsCacheRepository {
  private readonly logger = new Logger(SnapshotSurebetsCacheRepository.name);

  constructor(private readonly redis: RedisService) {}

  private key(type: SurebetType, snapshotId: string): string {
    return `surebets:snapshot:${type.toLowerCase()}:${snapshotId}`;
  }

  async setSnapshot(
    type: SurebetType,
    snapshotId: string,
    snapshot: NormalizedSurebetSnapshot,
    ttlSeconds: number,
  ): Promise<void> {
    await this.redis.set(
      this.key(type, snapshotId),
      JSON.stringify(snapshot),
      ttlSeconds,
    );
  }

  async getSnapshot(
    type: SurebetType,
    snapshotId: string,
  ): Promise<NormalizedSurebetSnapshot | null> {
    const raw = await this.redis.get(this.key(type, snapshotId));
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as NormalizedSurebetSnapshot;
    } catch {
      this.logger.warn(`Corrupted snapshot JSON for ${type}:${snapshotId}`);
      return null;
    }
  }

  async deleteSnapshot(type: SurebetType, snapshotId: string): Promise<void> {
    await this.redis.del(this.key(type, snapshotId));
  }
}
