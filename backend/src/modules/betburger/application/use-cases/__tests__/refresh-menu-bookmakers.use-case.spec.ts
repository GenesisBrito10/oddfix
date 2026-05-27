import type { ConfigType } from '@nestjs/config';
import betburgerConfig from '../../../../../common/config/betburger.config';
import { RedisService } from '../../../../../common/redis/redis.service';
import { BookmakerResolver } from '../../../domain/services/bookmaker-resolver.service';
import { BetburgerHttpClient } from '../../../infrastructure/http/betburger-http-client';
import {
  MENU_BOOKMAKERS_KEY,
  RefreshMenuBookmakersUseCase,
} from '../refresh-menu-bookmakers.use-case';

function build() {
  const client = {
    getSearchFilters: jest.fn((type: 'LIVE' | 'PREMATCH') =>
      Promise.resolve(
        type === 'LIVE'
          ? [{ id: 1741103, bookmakers1: ['1', '9'], bookmakers2: ['19'] }]
          : [{ id: 1149524, bookmakers1: ['461'], bookmakers2: [] }],
      ),
    ),
    getUserBookmakers: jest.fn().mockResolvedValue({
      bookmakers: [
        { bookmaker_id: 1, clone_id: 1269, active: true },
        { bookmaker_id: 9, clone_id: 1284, active: true },
        { bookmaker_id: 19, clone_id: 1282, active: true },
        { bookmaker_id: 461, clone_id: 1521, active: true },
        { bookmaker_id: 99, clone_id: null, active: true },
      ],
    }),
    getDirectories: jest.fn().mockResolvedValue({
      bookmaker_clones: [
        { id: 1269, name: 'Pinnacle.bet.br', url: null },
        { id: 1284, name: 'Sportingbet.bet.br', url: null },
        { id: 1282, name: 'KTO', url: 'https://www.kto.bet.br' },
        { id: 1521, name: 'BetNacional', url: null },
      ],
    }),
  };
  const store = new Map<string, string>();
  const redis = { set: jest.fn((k: string, v: string) => store.set(k, v)) };
  const config = {
    liveSearchFilterId: '1741103',
    prematchSearchFilterId: '1149524',
  } as unknown as ConfigType<typeof betburgerConfig>;

  const useCase = new RefreshMenuBookmakersUseCase(
    client as unknown as BetburgerHttpClient,
    new BookmakerResolver(),
    redis as unknown as RedisService,
    config,
  );
  return { useCase, client, redis, store };
}

describe('RefreshMenuBookmakersUseCase', () => {
  it('writes only the search-filter bookmakers (live ∪ prematch) resolved to names', async () => {
    const { useCase, redis, store } = build();
    const count = await useCase.execute();

    expect(count).toBe(4);
    expect(redis.set).toHaveBeenCalledWith(
      MENU_BOOKMAKERS_KEY,
      expect.any(String),
    );
    const menu = JSON.parse(store.get(MENU_BOOKMAKERS_KEY)!) as {
      externalBookmakerId: number;
      name: string;
    }[];
    expect(
      menu.map((b) => b.externalBookmakerId).sort((a, b) => a - b),
    ).toEqual([1, 9, 19, 461]);
    // 99 is not in any filter -> excluded
    expect(menu.some((b) => b.externalBookmakerId === 99)).toBe(false);
    // KTO resolved by clone
    expect(menu.find((b) => b.externalBookmakerId === 19)?.name).toBe('KTO');
    // sorted by name
    expect(menu.map((b) => b.name)).toEqual(
      [...menu.map((b) => b.name)].sort(),
    );
  });

  it('fetches search filters per type', async () => {
    const { useCase, client } = build();
    await useCase.execute();
    expect(client.getSearchFilters).toHaveBeenCalledWith('LIVE');
    expect(client.getSearchFilters).toHaveBeenCalledWith('PREMATCH');
  });
});
