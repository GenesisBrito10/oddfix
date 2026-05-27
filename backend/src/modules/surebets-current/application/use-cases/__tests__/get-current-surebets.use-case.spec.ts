import { NormalizedSurebet } from '../../contracts/normalized-surebet';
import { NormalizedSurebetSnapshot } from '../../contracts/normalized-surebet-snapshot';
import { CurrentSurebetsCacheRepository } from '../../../infrastructure/cache/current-surebets-cache.repository';
import { CurrentSurebetsFilterService } from '../../../domain/services/current-surebets-filter.service';
import { CurrentSurebetsPaginationService } from '../../../domain/services/current-surebets-pagination.service';
import { CurrentSurebetsSortService } from '../../../domain/services/current-surebets-sort.service';
import { GetCurrentSurebetsUseCase } from '../get-current-surebets.use-case';

function leg(name: string): NormalizedSurebet['legs'][number] {
  return {
    legIndex: 1,
    externalBetId: `bet-${name}`,
    bookmaker: { externalBookmakerId: 1, name, url: null },
    odd: 2,
    market: { marketTypeId: 1, name: 'Team1 Win', param: null },
    periodIdentifier: null,
  };
}

function surebet(
  arbHash: string,
  percent: number,
  sportName: string,
  sportId: number,
  bookmakers: string[],
  startedAt: string | null,
  name: string,
): NormalizedSurebet {
  return {
    arbHash,
    externalEventId: 1,
    percent,
    openingProfitPct: percent,
    arbType: '1:2',
    minKoef: 1,
    maxKoef: 2,
    event: {
      name,
      bookmakerEventName: null,
      leagueName: 'League',
      bookmakerLeagueName: null,
      sportId,
      sportName,
      team1Name: 'T1',
      team2Name: 'T2',
      startedAt,
      currentScore: null,
      isLive: true,
    },
    legs: bookmakers.map(leg),
  };
}

function snapshot(): NormalizedSurebetSnapshot {
  return {
    type: 'LIVE',
    snapshotId: 'live-1',
    fetchedAt: '2026-05-24T03:31:50.840Z',
    expiresAt: '2026-05-24T03:32:00.840Z',
    isStale: false,
    total: 3,
    surebets: [
      surebet(
        'a',
        5,
        'Baseball',
        1,
        ['BetNacional', 'Blaze'],
        '2026-05-24T05:00:00.000Z',
        'Alpha',
      ),
      surebet(
        'b',
        1,
        'Tennis',
        2,
        ['Pixbet', 'Blaze', 'Reals'],
        '2026-05-24T04:00:00.000Z',
        'Bravo',
      ),
      surebet('c', 3, 'Baseball', 1, ['Galera', 'OnaBet'], null, 'Charlie'),
    ],
    meta: {
      rawBets: 6,
      rawArbs: 3,
      normalized: 3,
      skipped: 0,
      missingBookmakers: 0,
      missingMarkets: 0,
      missingSports: 0,
    },
  };
}

function build(snapshotValue: NormalizedSurebetSnapshot | null) {
  const cache = {
    getCurrentSnapshot: jest.fn().mockResolvedValue(snapshotValue),
  };
  const useCase = new GetCurrentSurebetsUseCase(
    cache as unknown as CurrentSurebetsCacheRepository,
    new CurrentSurebetsFilterService(),
    new CurrentSurebetsSortService(),
    new CurrentSurebetsPaginationService(),
  );
  return { useCase, cache };
}

describe('GetCurrentSurebetsUseCase', () => {
  it('returns surebets from an existing snapshot', async () => {
    const { useCase } = build(snapshot());
    const result = await useCase.execute({ type: 'LIVE', page: 1, limit: 20 });
    expect(result.total).toBe(3);
    expect(result.filteredTotal).toBe(3);
    expect(result.surebets).toHaveLength(3);
    expect(result.snapshotId).toBe('live-1');
    expect(result.isStale).toBe(false);
  });

  it('returns empty/stale when no snapshot', async () => {
    const { useCase } = build(null);
    const result = await useCase.execute({ type: 'LIVE', page: 1, limit: 20 });
    expect(result.isStale).toBe(true);
    expect(result.total).toBe(0);
    expect(result.surebets).toEqual([]);
    expect(result.snapshotId).toBeNull();
  });

  it('reads the live key for type LIVE and prematch key for type PREMATCH', async () => {
    const { useCase, cache } = build(snapshot());
    await useCase.execute({ type: 'LIVE', page: 1, limit: 20 });
    expect(cache.getCurrentSnapshot).toHaveBeenCalledWith('LIVE');
    await useCase.execute({ type: 'PREMATCH', page: 1, limit: 20 });
    expect(cache.getCurrentSnapshot).toHaveBeenCalledWith('PREMATCH');
  });

  it('applies search', async () => {
    const { useCase } = build(snapshot());
    const result = await useCase.execute({
      type: 'LIVE',
      search: 'bravo',
      page: 1,
      limit: 20,
    });
    expect(result.filteredTotal).toBe(1);
    expect(result.surebets[0].arbHash).toBe('b');
  });

  it('applies minPercent and maxPercent', async () => {
    const min = await build(snapshot()).useCase.execute({
      type: 'LIVE',
      minPercent: 3,
      page: 1,
      limit: 20,
    });
    expect(min.surebets.map((s) => s.arbHash).sort()).toEqual(['a', 'c']);

    const max = await build(snapshot()).useCase.execute({
      type: 'LIVE',
      maxPercent: 3,
      page: 1,
      limit: 20,
    });
    expect(max.surebets.map((s) => s.arbHash).sort()).toEqual(['b', 'c']);
  });

  it('applies bookmakers filter (case-insensitive, any leg)', async () => {
    const { useCase } = build(snapshot());
    const result = await useCase.execute({
      type: 'LIVE',
      bookmakers: ['blaze'],
      page: 1,
      limit: 20,
    });
    expect(result.surebets.map((s) => s.arbHash).sort()).toEqual(['a', 'b']);
  });

  it('applies sports filter by name or id', async () => {
    const byName = await build(snapshot()).useCase.execute({
      type: 'LIVE',
      sports: ['tennis'],
      page: 1,
      limit: 20,
    });
    expect(byName.surebets.map((s) => s.arbHash)).toEqual(['b']);

    const byId = await build(snapshot()).useCase.execute({
      type: 'LIVE',
      sports: ['1'],
      page: 1,
      limit: 20,
    });
    expect(byId.surebets.map((s) => s.arbHash).sort()).toEqual(['a', 'c']);
  });

  it('applies legs filter', async () => {
    const { useCase } = build(snapshot());
    const result = await useCase.execute({
      type: 'LIVE',
      legs: 3,
      page: 1,
      limit: 20,
    });
    expect(result.surebets.map((s) => s.arbHash)).toEqual(['b']);
  });

  it('sorts by profit desc', async () => {
    const { useCase } = build(snapshot());
    const result = await useCase.execute({
      type: 'LIVE',
      sort: 'profit',
      page: 1,
      limit: 20,
    });
    expect(result.surebets.map((s) => s.arbHash)).toEqual(['a', 'c', 'b']);
  });

  it('sorts by start asc with null last', async () => {
    const { useCase } = build(snapshot());
    const result = await useCase.execute({
      type: 'LIVE',
      sort: 'start',
      page: 1,
      limit: 20,
    });
    expect(result.surebets.map((s) => s.arbHash)).toEqual(['b', 'a', 'c']);
  });

  it('paginates after filter + sort', async () => {
    const page1 = await build(snapshot()).useCase.execute({
      type: 'LIVE',
      sort: 'profit',
      page: 1,
      limit: 2,
    });
    expect(page1.surebets.map((s) => s.arbHash)).toEqual(['a', 'c']);
    expect(page1.filteredTotal).toBe(3);

    const page2 = await build(snapshot()).useCase.execute({
      type: 'LIVE',
      sort: 'profit',
      page: 2,
      limit: 2,
    });
    expect(page2.surebets.map((s) => s.arbHash)).toEqual(['b']);
  });

  it('only reads from the cache (no BetBurger dependency)', async () => {
    const { useCase, cache } = build(snapshot());
    await useCase.execute({ type: 'LIVE', page: 1, limit: 20 });
    expect(cache.getCurrentSnapshot).toHaveBeenCalledTimes(1);
  });
});
