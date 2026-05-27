import { Inject, Injectable, Logger } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import betburgerConfig from '../../../../common/config/betburger.config';
import { RedisService } from '../../../../common/redis/redis.service';
import { BetburgerHttpClient } from '../../../betburger/infrastructure/http/betburger-http-client';
import { BetburgerDistributedLock } from '../../../betburger/infrastructure/redis/betburger-distributed-lock.service';
import { BetburgerRateLimiter } from '../../../betburger/infrastructure/redis/betburger-rate-limiter.service';
import { BetburgerStatusCache } from '../../../betburger/infrastructure/redis/betburger-status-cache.service';
import { CurrentSurebetsCacheRepository } from '../../infrastructure/cache/current-surebets-cache.repository';
import { SnapshotSurebetsCacheRepository } from '../../infrastructure/cache/snapshot-surebets-cache.repository';
import { SurebetOpeningProfitCache } from '../../infrastructure/cache/surebet-opening-profit-cache.repository';
import { SurebetType } from '../contracts/normalized-surebet-snapshot';
import { RefreshSurebetsResult } from '../contracts/refresh-surebets-result';
import {
  surebetsUpdatedChannel,
  toStreamPayload,
} from '../contracts/surebets-stream-event';
import { NormalizeBetburgerSurebetsUseCase } from './normalize-betburger-surebets.use-case';

export interface RefreshBetburgerSurebetsInput {
  type: SurebetType;
}

/**
 * Orchestrates one refresh cycle:
 * lock -> rate limit -> pro_search -> normalize -> opening-profit enrich ->
 * current + snapshot caches -> status. The lock is always released; on error
 * the previous snapshot is kept (never deleted) and the app never crashes.
 */
@Injectable()
export class RefreshBetburgerSurebetsUseCase {
  private readonly logger = new Logger(RefreshBetburgerSurebetsUseCase.name);

  constructor(
    private readonly client: BetburgerHttpClient,
    private readonly rateLimiter: BetburgerRateLimiter,
    private readonly lock: BetburgerDistributedLock,
    private readonly statusCache: BetburgerStatusCache,
    private readonly normalizeUseCase: NormalizeBetburgerSurebetsUseCase,
    private readonly currentCache: CurrentSurebetsCacheRepository,
    private readonly snapshotCache: SnapshotSurebetsCacheRepository,
    private readonly openingProfitCache: SurebetOpeningProfitCache,
    private readonly redis: RedisService,
    @Inject(betburgerConfig.KEY)
    private readonly config: ConfigType<typeof betburgerConfig>,
  ) {}

  async execute(input: { type: SurebetType }): Promise<RefreshSurebetsResult> {
    const { type } = input;
    const lockKey = `betburger:lock:refresh:${type.toLowerCase()}`;
    const lockTtl =
      type === 'LIVE'
        ? this.config.liveRefreshLockTtlMs
        : this.config.prematchRefreshLockTtlMs;

    const { acquired, token } = await this.lock.acquire(lockKey, lockTtl);
    if (!acquired || !token) {
      return {
        type,
        status: 'SKIPPED_LOCKED',
        message: 'Refresh already running',
      };
    }

    try {
      await this.statusCache.markRefreshing(type);

      const rate = await this.rateLimiter.consume(type);
      if (!rate.allowed) {
        await this.statusCache.markRateLimited(type, rate.resetAt);
        return {
          type,
          status: 'RATE_LIMITED',
          rateLimit: {
            current: rate.current,
            limit: rate.limit,
            resetAt: rate.resetAt.toISOString(),
          },
        };
      }

      const rawResponse = await this.client.getProSearch(type);
      const snapshot = await this.normalizeUseCase.execute({
        type,
        rawResponse,
      });

      const openingProfitTtl =
        type === 'LIVE'
          ? this.config.liveOpeningProfitTtlSeconds
          : this.config.prematchOpeningProfitTtlSeconds;
      for (const surebet of snapshot.surebets) {
        if (surebet.percent !== null) {
          surebet.openingProfitPct =
            await this.openingProfitCache.getOrSetOpeningProfit(
              type,
              surebet.arbHash,
              surebet.percent,
              openingProfitTtl,
            );
        }
      }

      const currentTtl =
        type === 'LIVE'
          ? this.config.liveCurrentTtlSeconds
          : this.config.prematchCurrentTtlSeconds;
      const snapshotTtl =
        type === 'LIVE'
          ? this.config.liveSnapshotTtlSeconds
          : this.config.prematchSnapshotTtlSeconds;

      await this.currentCache.setCurrentSnapshot(type, snapshot, currentTtl);
      await this.snapshotCache.setSnapshot(
        type,
        snapshot.snapshotId,
        snapshot,
        snapshotTtl,
      );
      await this.statusCache.markSuccess(type, snapshot.snapshotId);

      // Push to SSE subscribers the moment the snapshot is live (best-effort).
      try {
        await this.redis.publish(
          surebetsUpdatedChannel(type),
          JSON.stringify(toStreamPayload(snapshot)),
        );
      } catch {
        // Publishing must never fail the refresh — clients still get next tick.
      }

      return {
        type,
        status: 'SUCCESS',
        snapshotId: snapshot.snapshotId,
        rawBets: snapshot.meta.rawBets,
        rawArbs: snapshot.meta.rawArbs,
        normalized: snapshot.meta.normalized,
        skipped: snapshot.meta.skipped,
        missingBookmakers: snapshot.meta.missingBookmakers,
        missingMarkets: snapshot.meta.missingMarkets,
        missingSports: snapshot.meta.missingSports,
        fetchedAt: snapshot.fetchedAt,
        expiresAt: snapshot.expiresAt,
      };
    } catch (error: unknown) {
      const message = this.sanitize(
        error instanceof Error ? error.message : 'Unknown refresh error',
      );
      this.logger.warn(`Refresh ${type} failed: ${message}`);
      // Keep the previous snapshot; just flag the integration status.
      await this.statusCache.markError(type, message);
      return { type, status: 'ERROR', message };
    } finally {
      await this.lock.release(lockKey, token);
    }
  }

  private sanitize(message: string): string {
    return message.replace(/access_token=[^&\s]+/gi, 'access_token=***');
  }
}
