import { BookmakerResolver } from '../../../domain/services/bookmaker-resolver.service';
import { BetburgerHttpClient } from '../../../infrastructure/http/betburger-http-client';
import { BetburgerDirectoriesResponse } from '../../../infrastructure/http/dto/betburger-directories.response';
import { BetburgerUserBookmakersResponse } from '../../../infrastructure/http/dto/betburger-user-bookmakers.response';
import { BETBURGER_MARKET_TYPES } from '../../../infrastructure/static/betburger-market-types';
import { SyncBetburgerCatalogUseCase } from '../sync-betburger-catalog.use-case';
import {
  FakeBetburgerClient,
  InMemoryBookmakersRepository,
  InMemoryMarketTypesRepository,
  InMemorySportsRepository,
} from './_fakes';

function build(
  userBookmakers: BetburgerUserBookmakersResponse,
  directories: BetburgerDirectoriesResponse,
) {
  const client = new FakeBetburgerClient(
    userBookmakers,
    directories,
  ) as unknown as BetburgerHttpClient;
  const bookmakersRepo = new InMemoryBookmakersRepository();
  const sportsRepo = new InMemorySportsRepository();
  const marketTypesRepo = new InMemoryMarketTypesRepository();
  const useCase = new SyncBetburgerCatalogUseCase(
    client,
    new BookmakerResolver(),
    bookmakersRepo,
    sportsRepo,
    marketTypesRepo,
  );
  return { useCase, bookmakersRepo, sportsRepo, marketTypesRepo };
}

describe('SyncBetburgerCatalogUseCase', () => {
  it('syncs catalog and returns counts', async () => {
    const { useCase, bookmakersRepo, sportsRepo, marketTypesRepo } = build(
      {
        bookmakers: [
          { bookmaker_id: 461, clone_id: 1521 },
          { bookmaker_id: 127, clone_id: 99 },
        ],
      },
      {
        bookmaker_clones: [
          { id: 1521, name: 'BetNacional', url: 'https://betnacional.bet.br/' },
        ],
        sports: [{ id: 1, name: 'Soccer', sport_category_id: 5 }],
        sport_categories: [{ id: 5, name: 'Football' }],
      },
    );

    const result = await useCase.execute();

    expect(result.bookmakers.received).toBe(2);
    expect(result.bookmakers.upserted).toBe(2);
    expect(result.bookmakers.fallbacks).toBe(1);
    expect(result.sports.received).toBe(1);
    expect(result.sports.upserted).toBe(1);
    expect(result.marketTypes.received).toBe(BETBURGER_MARKET_TYPES.length);
    expect(typeof result.syncedAt).toBe('string');

    expect(bookmakersRepo.saved).toHaveLength(2);
    expect(sportsRepo.saved[0].categoryName).toBe('Football');
    expect(marketTypesRepo.saved).toHaveLength(BETBURGER_MARKET_TYPES.length);
  });

  it('does not break when clones are missing (everything falls back)', async () => {
    const { useCase } = build(
      { bookmakers: [{ bookmaker_id: 1, clone_id: null }] },
      {},
    );

    const result = await useCase.execute();

    expect(result.bookmakers.fallbacks).toBe(1);
    expect(result.sports.received).toBe(0);
  });
});
