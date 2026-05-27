import { NotFoundException } from '@nestjs/common';
import {
  RegisteredSurebetRecord,
  RegisteredSurebetsRepository,
} from '../../../domain/repositories/registered-surebets.repository';
import { GetRegisteredSurebetUseCase } from '../get-registered-surebet.use-case';
import { ListRegisteredSurebetsUseCase } from '../list-registered-surebets.use-case';
import { UpdateRegisteredSurebetLegResultUseCase } from '../update-registered-surebet-leg-result.use-case';
import { UpdateRegisteredSurebetStatusUseCase } from '../update-registered-surebet-status.use-case';

function record(
  over: Partial<RegisteredSurebetRecord> = {},
): RegisteredSurebetRecord {
  return {
    id: 'reg-1',
    userId: 'user-1',
    arbHash: 'arb-1',
    externalEventId: 111n,
    type: 'LIVE',
    percent: 1.2,
    arbType: '1:2',
    minKoef: 2,
    maxKoef: 2.04,
    eventName: 'Flamengo - Palmeiras',
    leagueName: 'Brasileirao',
    sportId: 1,
    sportName: 'Soccer',
    team1Name: 'Flamengo',
    team2Name: 'Palmeiras',
    currentScoreWhenRegistered: '0:0',
    status: 'PENDING',
    registeredAt: new Date('2026-05-24T10:00:00.000Z'),
    updatedAt: new Date('2026-05-24T10:00:00.000Z'),
    legs: [
      {
        id: 'leg-1',
        legIndex: 1,
        externalBetId: 'bet-1',
        externalBookmakerId: 387,
        bookmakerName: 'BetNacional',
        bookmakerUrl: 'https://betnacional.bet.br/',
        odd: 2,
        marketTypeId: 17,
        marketName: 'European Handicap2(4.0)',
        marketParam: 4,
        result: 'PENDING',
      },
    ],
    ...over,
  };
}

function repo(overrides: Partial<RegisteredSurebetsRepository>) {
  return overrides as unknown as RegisteredSurebetsRepository;
}

describe('ListRegisteredSurebetsUseCase', () => {
  it('forwards userId + filters to the repository and maps items', async () => {
    const listByUser = jest
      .fn()
      .mockResolvedValue({ items: [record()], total: 5 });
    const useCase = new ListRegisteredSurebetsUseCase(repo({ listByUser }));

    const res = await useCase.execute({
      userId: 'user-1',
      status: 'GREEN',
      type: 'LIVE',
      search: 'flamengo',
      sort: 'percent_desc',
      page: 2,
      limit: 2,
    });

    expect(listByUser).toHaveBeenCalledWith({
      userId: 'user-1',
      status: 'GREEN',
      type: 'LIVE',
      search: 'flamengo',
      sort: 'percent_desc',
      page: 2,
      limit: 2,
    });
    expect(res.items).toHaveLength(1);
    expect(res.items[0].externalEventId).toBe('111');
  });

  it('computes pagination total/totalPages', async () => {
    const listByUser = jest.fn().mockResolvedValue({ items: [], total: 5 });
    const useCase = new ListRegisteredSurebetsUseCase(repo({ listByUser }));

    const res = await useCase.execute({
      userId: 'user-1',
      sort: 'registeredAt_desc',
      page: 1,
      limit: 2,
    });

    expect(res.pagination).toEqual({
      page: 1,
      limit: 2,
      total: 5,
      totalPages: 3,
    });
  });
});

describe('GetRegisteredSurebetUseCase', () => {
  it('returns the item when it belongs to the user', async () => {
    const findByIdForUser = jest.fn().mockResolvedValue(record());
    const useCase = new GetRegisteredSurebetUseCase(repo({ findByIdForUser }));

    const res = await useCase.execute('reg-1', 'user-1');
    expect(findByIdForUser).toHaveBeenCalledWith('reg-1', 'user-1');
    expect(res.id).toBe('reg-1');
    expect(res.legs[0].result).toBe('PENDING');
  });

  it('throws 404 when not found / owned by another user', async () => {
    const findByIdForUser = jest.fn().mockResolvedValue(null);
    const useCase = new GetRegisteredSurebetUseCase(repo({ findByIdForUser }));
    await expect(useCase.execute('reg-x', 'user-1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});

describe('UpdateRegisteredSurebetStatusUseCase', () => {
  it('updates status and returns the updated item', async () => {
    const updateStatus = jest
      .fn()
      .mockResolvedValue(record({ status: 'GREEN' }));
    const useCase = new UpdateRegisteredSurebetStatusUseCase(
      repo({ updateStatus }),
    );

    const res = await useCase.execute({
      id: 'reg-1',
      userId: 'user-1',
      status: 'GREEN',
    });
    expect(updateStatus).toHaveBeenCalledWith('reg-1', 'user-1', 'GREEN');
    expect(res.status).toBe('GREEN');
  });

  it('throws 404 when row not owned by the user', async () => {
    const updateStatus = jest.fn().mockResolvedValue(null);
    const useCase = new UpdateRegisteredSurebetStatusUseCase(
      repo({ updateStatus }),
    );
    await expect(
      useCase.execute({ id: 'reg-1', userId: 'other', status: 'GREEN' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});

describe('UpdateRegisteredSurebetLegResultUseCase', () => {
  it('updates the leg result and returns the updated item', async () => {
    const updateLegResult = jest.fn().mockResolvedValue(
      record({
        legs: [{ ...record().legs[0], result: 'RED' }],
      }),
    );
    const useCase = new UpdateRegisteredSurebetLegResultUseCase(
      repo({ updateLegResult }),
    );

    const res = await useCase.execute({
      id: 'reg-1',
      legId: 'leg-1',
      userId: 'user-1',
      result: 'RED',
    });
    expect(updateLegResult).toHaveBeenCalledWith(
      'reg-1',
      'leg-1',
      'user-1',
      'RED',
    );
    expect(res.legs[0].result).toBe('RED');
  });

  it('throws 404 when the leg/surebet is not owned by the user', async () => {
    const updateLegResult = jest.fn().mockResolvedValue(null);
    const useCase = new UpdateRegisteredSurebetLegResultUseCase(
      repo({ updateLegResult }),
    );
    await expect(
      useCase.execute({
        id: 'reg-1',
        legId: 'leg-x',
        userId: 'user-1',
        result: 'RED',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
