import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../../../../common/redis/redis.service';
import {
  BetburgerIntegrationStatus,
  BetburgerType,
} from '../../application/contracts/betburger-integration';

/** Persists integration status at `betburger:status:{type}`. */
@Injectable()
export class BetburgerStatusCache {
  private readonly logger = new Logger(BetburgerStatusCache.name);

  constructor(private readonly redis: RedisService) {}

  private key(type: BetburgerType): string {
    return `betburger:status:${type.toLowerCase()}`;
  }

  async setStatus(
    type: BetburgerType,
    status: BetburgerIntegrationStatus,
  ): Promise<void> {
    await this.redis.set(this.key(type), JSON.stringify(status));
  }

  async getStatus(
    type: BetburgerType,
  ): Promise<BetburgerIntegrationStatus | null> {
    const raw = await this.redis.get(this.key(type));
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as BetburgerIntegrationStatus;
    } catch {
      this.logger.warn(`Corrupted status JSON for ${type}`);
      return null;
    }
  }

  async markRefreshing(type: BetburgerType): Promise<void> {
    const base = await this.base(type);
    await this.setStatus(type, {
      ...base,
      status: 'REFRESHING',
      message: null,
    });
  }

  async markSuccess(type: BetburgerType, snapshotId: string): Promise<void> {
    const base = await this.base(type);
    await this.setStatus(type, {
      ...base,
      status: 'SUCCESS',
      lastSuccessAt: new Date().toISOString(),
      lastSnapshotId: snapshotId,
      nextAttemptAt: null,
      message: null,
    });
  }

  async markError(type: BetburgerType, message: string): Promise<void> {
    const base = await this.base(type);
    await this.setStatus(type, {
      ...base,
      status: 'ERROR',
      lastErrorAt: new Date().toISOString(),
      message: this.sanitize(message),
    });
  }

  async markRateLimited(
    type: BetburgerType,
    nextAttemptAt: Date,
  ): Promise<void> {
    const base = await this.base(type);
    await this.setStatus(type, {
      ...base,
      status: 'RATE_LIMITED',
      nextAttemptAt: nextAttemptAt.toISOString(),
      message: null,
    });
  }

  async markStale(type: BetburgerType, message?: string): Promise<void> {
    const base = await this.base(type);
    await this.setStatus(type, {
      ...base,
      status: 'STALE',
      message: message ? this.sanitize(message) : base.message,
    });
  }

  private async base(type: BetburgerType): Promise<BetburgerIntegrationStatus> {
    const previous = await this.getStatus(type);
    return (
      previous ?? {
        type,
        status: 'IDLE',
        lastSuccessAt: null,
        lastErrorAt: null,
        nextAttemptAt: null,
        lastSnapshotId: null,
        message: null,
      }
    );
  }

  /** Never let an access_token leak into a persisted status message. */
  private sanitize(message: string): string {
    return message.replace(/access_token=[^&\s]+/gi, 'access_token=***');
  }
}
