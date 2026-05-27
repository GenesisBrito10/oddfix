import { RedisService } from '../../../../../common/redis/redis.service';
import { InMemoryRedis } from '../../../../../common/redis/__tests__/in-memory-redis.fake';
import { NormalizedSurebetSnapshot } from '../../../application/contracts/normalized-surebet-snapshot';
import { SnapshotSurebetsCacheRepository } from '../snapshot-surebets-cache.repository';

const snapshot: NormalizedSurebetSnapshot = {
  type: 'LIVE',
  snapshotId: 'live-123',
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

describe('SnapshotSurebetsCacheRepository', () => {
  let redis: InMemoryRedis;
  let repo: SnapshotSurebetsCacheRepository;

  beforeEach(() => {
    redis = new InMemoryRedis();
    repo = new SnapshotSurebetsCacheRepository(
      redis as unknown as RedisService,
    );
  });

  it('sets and gets a snapshot by snapshotId and builds the right key', async () => {
    await repo.setSnapshot('LIVE', 'live-123', snapshot, 60);
    expect(redis.store.has('surebets:snapshot:live:live-123')).toBe(true);
    const result = await repo.getSnapshot('LIVE', 'live-123');
    expect(result?.snapshotId).toBe('live-123');
  });

  it('returns null when the snapshot is missing/expired', async () => {
    expect(await repo.getSnapshot('LIVE', 'missing')).toBeNull();
  });

  it('returns null on corrupted JSON', async () => {
    redis.store.set('surebets:snapshot:prematch:x', 'broken');
    expect(await repo.getSnapshot('PREMATCH', 'x')).toBeNull();
  });
});
