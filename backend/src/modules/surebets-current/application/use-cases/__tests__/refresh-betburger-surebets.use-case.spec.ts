import type { ConfigType } from '@nestjs/config';
import betburgerConfig from '../../../../../common/config/betburger.config';
import { RedisService } from '../../../../../common/redis/redis.service';
import { BetburgerHttpClient } from '../../../../betburger/infrastructure/http/betburger-http-client';
import { BetburgerDistributedLock } from '../../../../betburger/infrastructure/redis/betburger-distributed-lock.service';
import { BetburgerRateLimiter } from '../../../../betburger/infrastructure/redis/betburger-rate-limiter.service';
import { BetburgerStatusCache } from '../../../../betburger/infrastructure/redis/betburger-status-cache.service';
import { CurrentSurebetsCacheRepository } from '../../../infrastructure/cache/current-surebets-cache.repository';
import { SnapshotSurebetsCacheRepository } from '../../../infrastructure/cache/snapshot-surebets-cache.repository';
import { SurebetOpeningProfitCache } from '../../../infrastructure/cache/surebet-opening-profit-cache.repository';
import {
  NormalizedSurebetSnapshot,
  SurebetType,
} from '../../contracts/normalized-surebet-snapshot';
import { NormalizeBetburgerSurebetsUseCase } from '../normalize-betburger-surebets.use-case';
import { RefreshBetburgerSurebetsUseCase } from '../refresh-betburger-surebets.use-case';

function buildSnapshot(): NormalizedSurebetSnapshot {
  return {
    type: 'LIVE',
    snapshotId: 'live-123',
    fetchedAt: '2026-05-24T03:31:50.840Z',
    expiresAt: '2026-05-24T03:32:00.840Z',
    isStale: false,
    total: 1,
    surebets: [
      {
        arbHash: 'arb-1',
        externalEventId: 1,
        percent: 5,
        openingProfitPct: 5,
        arbType: '1:2',
        minKoef: 2,
        maxKoef: 2.1,
        event: {
          name: 'A - B',
          bookmakerEventName: null,
          leagueName: null,
          bookmakerLeagueName: null,
          sportId: 1,
          sportName: 'Baseball',
          team1Name: 'A',
          team2Name: 'B',
          startedAt: null,
          currentScore: null,
          isLive: true,
        },
        legs: [],
      },
    ],
    meta: {
      rawBets: 2,
      rawArbs: 1,
      normalized: 1,
      skipped: 0,
      missingBookmakers: 0,
      missingMarkets: 0,
      missingSports: 0,
    },
  };
}

const config = {
  liveRefreshLockTtlMs: 2500,
  prematchRefreshLockTtlMs: 5000,
  liveOpeningProfitTtlSeconds: 600,
  prematchOpeningProfitTtlSeconds: 3600,
  liveCurrentTtlSeconds: 10,
  liveSnapshotTtlSeconds: 60,
  prematchCurrentTtlSeconds: 20,
  prematchSnapshotTtlSeconds: 120,
} as unknown as ConfigType<typeof betburgerConfig>;

interface Mocks {
  client: { getProSearch: jest.Mock };
  rate: { consume: jest.Mock };
  lock: { acquire: jest.Mock; release: jest.Mock };
  status: {
    markRefreshing: jest.Mock;
    markRateLimited: jest.Mock;
    markError: jest.Mock;
    markSuccess: jest.Mock;
  };
  normalize: { execute: jest.Mock };
  current: { setCurrentSnapshot: jest.Mock };
  snapshot: { setSnapshot: jest.Mock };
  opening: { getOrSetOpeningProfit: jest.Mock };
  redis: { publish: jest.Mock };
}

function build(overrides: Partial<Mocks> = {}) {
  const mocks: Mocks = {
    client: {
      getProSearch: jest.fn().mockResolvedValue({ bets: [], arbs: [] }),
    },
    rate: {
      consume: jest.fn().mockResolvedValue({
        allowed: true,
        current: 1,
        limit: 1800,
        resetAt: new Date('2026-05-24T04:00:00.000Z'),
      }),
    },
    lock: {
      acquire: jest.fn().mockResolvedValue({ acquired: true, token: 'tok' }),
      release: jest.fn().mockResolvedValue(true),
    },
    status: {
      markRefreshing: jest.fn().mockResolvedValue(undefined),
      markRateLimited: jest.fn().mockResolvedValue(undefined),
      markError: jest.fn().mockResolvedValue(undefined),
      markSuccess: jest.fn().mockResolvedValue(undefined),
    },
    normalize: { execute: jest.fn().mockResolvedValue(buildSnapshot()) },
    current: { setCurrentSnapshot: jest.fn().mockResolvedValue(undefined) },
    snapshot: { setSnapshot: jest.fn().mockResolvedValue(undefined) },
    opening: { getOrSetOpeningProfit: jest.fn().mockResolvedValue(9) },
    redis: { publish: jest.fn().mockResolvedValue(1) },
    ...overrides,
  };

  const useCase = new RefreshBetburgerSurebetsUseCase(
    mocks.client as unknown as BetburgerHttpClient,
    mocks.rate as unknown as BetburgerRateLimiter,
    mocks.lock as unknown as BetburgerDistributedLock,
    mocks.status as unknown as BetburgerStatusCache,
    mocks.normalize as unknown as NormalizeBetburgerSurebetsUseCase,
    mocks.current as unknown as CurrentSurebetsCacheRepository,
    mocks.snapshot as unknown as SnapshotSurebetsCacheRepository,
    mocks.opening as unknown as SurebetOpeningProfitCache,
    mocks.redis as unknown as RedisService,
    config,
  );
  return { useCase, mocks };
}

describe('RefreshBetburgerSurebetsUseCase', () => {
  it('runs the full happy path and applies opening profit', async () => {
    const { useCase, mocks } = build();
    const result = await useCase.execute({ type: 'LIVE' });

    expect(result.status).toBe('SUCCESS');
    expect(result.snapshotId).toBe('live-123');
    expect(mocks.status.markRefreshing).toHaveBeenCalled();
    expect(mocks.client.getProSearch).toHaveBeenCalledWith('LIVE');
    expect(mocks.current.setCurrentSnapshot).toHaveBeenCalled();
    expect(mocks.snapshot.setSnapshot).toHaveBeenCalled();
    expect(mocks.status.markSuccess).toHaveBeenCalledWith('LIVE', 'live-123');
    expect(mocks.lock.release).toHaveBeenCalled();

    // SSE push: publishes the snapshot on the live channel after success.
    const publishCalls = mocks.redis.publish.mock.calls as unknown as [
      string,
      string,
    ][];
    expect(publishCalls[0][0]).toBe('surebets:updated:live');
    expect(publishCalls[0][1]).toContain('live-123');

    const setCalls = mocks.current.setCurrentSnapshot.mock.calls as unknown as [
      SurebetType,
      NormalizedSurebetSnapshot,
    ][];
    expect(setCalls[0][1].surebets[0].openingProfitPct).toBe(9);
  });

  it('returns SKIPPED_LOCKED without consuming rate or calling the client', async () => {
    const { useCase, mocks } = build({
      lock: {
        acquire: jest.fn().mockResolvedValue({ acquired: false }),
        release: jest.fn().mockResolvedValue(true),
      },
    });
    const result = await useCase.execute({ type: 'LIVE' });

    expect(result.status).toBe('SKIPPED_LOCKED');
    expect(mocks.rate.consume).not.toHaveBeenCalled();
    expect(mocks.client.getProSearch).not.toHaveBeenCalled();
  });

  it('returns RATE_LIMITED and releases the lock without calling the client', async () => {
    const { useCase, mocks } = build({
      rate: {
        consume: jest.fn().mockResolvedValue({
          allowed: false,
          current: 1801,
          limit: 1800,
          resetAt: new Date('2026-05-24T04:00:00.000Z'),
        }),
      },
    });
    const result = await useCase.execute({ type: 'LIVE' });

    expect(result.status).toBe('RATE_LIMITED');
    expect(result.rateLimit?.current).toBe(1801);
    expect(mocks.client.getProSearch).not.toHaveBeenCalled();
    expect(mocks.status.markRateLimited).toHaveBeenCalled();
    expect(mocks.lock.release).toHaveBeenCalled();
  });

  it('handles a client failure: ERROR, keeps previous snapshot, releases lock, sanitizes token', async () => {
    const { useCase, mocks } = build({
      client: {
        getProSearch: jest
          .fn()
          .mockRejectedValue(new Error('boom access_token=SECRET')),
      },
    });
    const result = await useCase.execute({ type: 'LIVE' });

    expect(result.status).toBe('ERROR');
    expect(result.message).toContain('access_token=***');
    expect(result.message).not.toContain('SECRET');
    expect(mocks.current.setCurrentSnapshot).not.toHaveBeenCalled();
    expect(mocks.status.markError).toHaveBeenCalled();
    expect(mocks.lock.release).toHaveBeenCalled();
  });
});
