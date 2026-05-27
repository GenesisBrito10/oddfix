import { GoneException, NotFoundException } from '@nestjs/common';
import { NormalizedSurebet } from '../../../../surebets-current/application/contracts/normalized-surebet';
import { NormalizedSurebetSnapshot } from '../../../../surebets-current/application/contracts/normalized-surebet-snapshot';
import { SnapshotSurebetsCacheRepository } from '../../../../surebets-current/infrastructure/cache/snapshot-surebets-cache.repository';
import {
  CreateRegisteredSurebetData,
  RegisteredSurebetRecord,
} from '../../../domain/repositories/registered-surebets.repository';
import { RegisterSurebetUseCase } from '../register-surebet.use-case';

function surebet(arbHash: string): NormalizedSurebet {
  return {
    arbHash,
    externalEventId: 73488520,
    percent: 0.99,
    openingProfitPct: 0.99,
    arbType: '1:2',
    minKoef: 1.5,
    maxKoef: 2,
    event: {
      name: 'Arizona Diamondbacks - Colorado Rockies',
      bookmakerEventName: null,
      leagueName: 'USA. MLB',
      bookmakerLeagueName: null,
      sportId: 3,
      sportName: 'Baseball',
      team1Name: 'Arizona Diamondbacks',
      team2Name: 'Colorado Rockies',
      startedAt: null,
      currentScore: '2:1',
      isLive: true,
    },
    legs: [
      {
        legIndex: 1,
        externalBetId: 'bet-1',
        bookmaker: {
          externalBookmakerId: 387,
          name: 'BetNacional',
          url: 'https://betnacional.bet.br/',
        },
        odd: 2,
        market: { marketTypeId: 17, name: 'European Handicap2(4.0)', param: 4 },
        periodIdentifier: null,
      },
      {
        legIndex: 2,
        externalBetId: 'bet-2',
        bookmaker: { externalBookmakerId: 390, name: 'Blaze', url: null },
        odd: 2.1,
        market: { marketTypeId: 18, name: 'European Handicap1(4.0)', param: 4 },
        periodIdentifier: null,
      },
    ],
  };
}

function snapshot(): NormalizedSurebetSnapshot {
  return {
    type: 'LIVE',
    snapshotId: 'live-1779593510840',
    fetchedAt: '2026-05-24T03:31:50.840Z',
    expiresAt: '2026-05-24T03:32:00.840Z',
    isStale: false,
    total: 3,
    surebets: [
      surebet('aaa'),
      surebet('8e453b6c5929c6aee2b01ec96a7b95ee'),
      surebet('ccc'),
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

function recordFrom(
  data: CreateRegisteredSurebetData,
): RegisteredSurebetRecord {
  return {
    id: 'reg-uuid',
    userId: data.userId,
    arbHash: data.arbHash,
    externalEventId: data.externalEventId,
    type: data.type,
    percent: data.percent,
    arbType: data.arbType,
    minKoef: data.minKoef,
    maxKoef: data.maxKoef,
    eventName: data.eventName,
    leagueName: data.leagueName,
    sportId: data.sportId,
    sportName: data.sportName,
    team1Name: data.team1Name,
    team2Name: data.team2Name,
    currentScoreWhenRegistered: data.currentScoreWhenRegistered,
    status: 'PENDING',
    registeredAt: new Date('2026-05-24T03:31:55.000Z'),
    updatedAt: new Date('2026-05-24T03:31:55.000Z'),
    legs: data.legs.map((leg, index) => ({
      id: `leg-${index}`,
      legIndex: leg.legIndex,
      externalBetId: leg.externalBetId,
      externalBookmakerId: leg.externalBookmakerId,
      bookmakerName: leg.bookmakerName,
      bookmakerUrl: leg.bookmakerUrl,
      odd: leg.odd,
      marketTypeId: leg.marketTypeId,
      marketName: leg.marketName,
      marketParam: leg.marketParam,
      result: 'PENDING',
    })),
  };
}

function build(snapshotValue: NormalizedSurebetSnapshot | null) {
  const cache = { getSnapshot: jest.fn().mockResolvedValue(snapshotValue) };
  const repository = {
    create: jest
      .fn<Promise<RegisteredSurebetRecord>, [CreateRegisteredSurebetData]>()
      .mockImplementation((data) => Promise.resolve(recordFrom(data))),
  };
  const useCase = new RegisterSurebetUseCase(
    cache as unknown as SnapshotSurebetsCacheRepository,
    repository,
  );
  return { useCase, cache, repository };
}

const ARB = '8e453b6c5929c6aee2b01ec96a7b95ee';

describe('RegisterSurebetUseCase', () => {
  it('registers a surebet when snapshot + arbHash exist', async () => {
    const { useCase, cache } = build(snapshot());
    const result = await useCase.execute({
      userId: 'user-1',
      type: 'LIVE',
      snapshotId: 'live-1779593510840',
      arbHash: ARB,
    });

    expect(cache.getSnapshot).toHaveBeenCalledWith(
      'LIVE',
      'live-1779593510840',
    );
    expect(result.id).toBe('reg-uuid');
    expect(result.userId).toBe('user-1');
    expect(result.arbHash).toBe(ARB);
    expect(result.externalEventId).toBe('73488520');
    expect(result.status).toBe('PENDING');
    expect(result.legs).toHaveLength(2);
  });

  it('throws Gone (410) when snapshot expired/missing', async () => {
    const { useCase, repository } = build(null);
    await expect(
      useCase.execute({
        userId: 'user-1',
        type: 'LIVE',
        snapshotId: 'gone',
        arbHash: ARB,
      }),
    ).rejects.toBeInstanceOf(GoneException);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('throws NotFound (404) when arbHash not in snapshot', async () => {
    const { useCase, repository } = build(snapshot());
    await expect(
      useCase.execute({
        userId: 'user-1',
        type: 'LIVE',
        snapshotId: 'live-1779593510840',
        arbHash: 'does-not-exist',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('persists ONLY the selected surebet (snapshot has 3)', async () => {
    const { useCase, repository } = build(snapshot());
    await useCase.execute({
      userId: 'user-1',
      type: 'LIVE',
      snapshotId: 'live-1779593510840',
      arbHash: ARB,
    });

    expect(repository.create).toHaveBeenCalledTimes(1);
    const data = repository.create.mock.calls[0][0];
    expect(data.arbHash).toBe(ARB);
  });

  it('maps legs correctly (name/url/odd/market/param/externalBetId)', async () => {
    const { useCase, repository } = build(snapshot());
    await useCase.execute({
      userId: 'user-1',
      type: 'LIVE',
      snapshotId: 'live-1779593510840',
      arbHash: ARB,
    });

    const data = repository.create.mock.calls[0][0];
    expect(data.legs[0]).toEqual({
      legIndex: 1,
      externalBetId: 'bet-1',
      externalBookmakerId: 387,
      bookmakerName: 'BetNacional',
      bookmakerUrl: 'https://betnacional.bet.br/',
      odd: 2,
      marketTypeId: 17,
      marketName: 'European Handicap2(4.0)',
      marketParam: 4,
    });
    expect(data.legs[1].bookmakerUrl).toBeNull();
  });

  it('passes userId from the caller (JWT) to the repository', async () => {
    const { useCase, repository } = build(snapshot());
    await useCase.execute({
      userId: 'user-from-jwt',
      type: 'LIVE',
      snapshotId: 'live-1779593510840',
      arbHash: ARB,
    });
    expect(repository.create.mock.calls[0][0].userId).toBe('user-from-jwt');
  });

  it('stores rawSnapshot with metadata + selected surebet', async () => {
    const { useCase, repository } = build(snapshot());
    await useCase.execute({
      userId: 'user-1',
      type: 'LIVE',
      snapshotId: 'live-1779593510840',
      arbHash: ARB,
    });

    const raw = repository.create.mock.calls[0][0].rawSnapshot as {
      snapshotId: string;
      arbHash: string;
      surebet: NormalizedSurebet;
    };
    expect(raw.snapshotId).toBe('live-1779593510840');
    expect(raw.arbHash).toBe(ARB);
    expect(raw.surebet.arbHash).toBe(ARB);
  });

  it('does not depend on BetBurger (only snapshot cache + repository)', () => {
    const useCase = new RegisterSurebetUseCase(
      { getSnapshot: jest.fn() } as unknown as SnapshotSurebetsCacheRepository,
      { create: jest.fn() },
    );
    expect(useCase).toBeInstanceOf(RegisterSurebetUseCase);
  });
});
