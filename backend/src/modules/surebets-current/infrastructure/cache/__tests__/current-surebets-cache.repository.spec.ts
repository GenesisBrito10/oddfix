import { RedisService } from '../../../../../common/redis/redis.service';
import { InMemoryRedis } from '../../../../../common/redis/__tests__/in-memory-redis.fake';
import { NormalizedSurebetSnapshot } from '../../../application/contracts/normalized-surebet-snapshot';
import { CurrentSurebetsCacheRepository } from '../current-surebets-cache.repository';

function snapshot(type: 'LIVE' | 'PREMATCH'): NormalizedSurebetSnapshot {
  return {
    type,
    snapshotId: `${type.toLowerCase()}-1`,
    fetchedAt: '2026-05-24T03:31:50.840Z',
    expiresAt: '2026-05-24T03:32:00.840Z',
    isStale: false,
    total: 0,
    surebets: [],
    meta: {
      rawBets: 0,
      rawArbs: 0,
      normalized: 0,
      skipped: 0,
      missingBookmakers: 0,
      missingMarkets: 0,
      missingSports: 0,
    },
  };
}

describe('CurrentSurebetsCacheRepository', () => {
  let redis: InMemoryRedis;
  let repo: CurrentSurebetsCacheRepository;

  beforeEach(() => {
    redis = new InMemoryRedis();
    repo = new CurrentSurebetsCacheRepository(redis as unknown as RedisService);
  });

  it('sets and gets a live snapshot', async () => {
    await repo.setCurrentSnapshot('LIVE', snapshot('LIVE'), 10);
    expect(redis.store.has('surebets:current:live')).toBe(true);
    const result = await repo.getCurrentSnapshot('LIVE');
    expect(result?.snapshotId).toBe('live-1');
  });

  it('sets and gets a prematch snapshot independently', async () => {
    await repo.setCurrentSnapshot('PREMATCH', snapshot('PREMATCH'), 20);
    const result = await repo.getCurrentSnapshot('PREMATCH');
    expect(result?.type).toBe('PREMATCH');
    expect(await repo.getCurrentSnapshot('LIVE')).toBeNull();
  });

  it('returns null when missing', async () => {
    expect(await repo.getCurrentSnapshot('LIVE')).toBeNull();
  });

  it('returns null on corrupted JSON', async () => {
    redis.store.set('surebets:current:live', 'not-json');
    expect(await repo.getCurrentSnapshot('LIVE')).toBeNull();
  });
});
