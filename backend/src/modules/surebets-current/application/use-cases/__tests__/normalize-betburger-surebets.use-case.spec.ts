import type { ConfigType } from '@nestjs/config';
import betburgerConfig from '../../../../../common/config/betburger.config';
import { BookmakerCatalogRepository } from '../../../domain/repositories/bookmaker-catalog.repository';
import { MarketTypeCatalogRepository } from '../../../domain/repositories/market-type-catalog.repository';
import { SportCatalogRepository } from '../../../domain/repositories/sport-catalog.repository';
import { MarketNameResolver } from '../../../domain/services/market-name-resolver.service';
import { SurebetNormalizer } from '../../../domain/services/surebet-normalizer.service';
import { proSearchFixtureTwoLegs } from '../../../infrastructure/fixtures/betburger-pro-search.fixture';
import { NormalizeBetburgerSurebetsUseCase } from '../normalize-betburger-surebets.use-case';

class FakeBookmakerCatalog extends BookmakerCatalogRepository {
  loadAll() {
    return Promise.resolve([
      {
        externalBookmakerId: 461,
        name: 'BetNacional',
        url: 'https://betnacional.bet.br/',
      },
      { externalBookmakerId: 127, name: 'Blaze', url: 'https://blaze.com/' },
    ]);
  }
}
class FakeSportCatalog extends SportCatalogRepository {
  loadAll() {
    return Promise.resolve([{ externalSportId: 1, name: 'Baseball' }]);
  }
}
class FakeMarketTypeCatalog extends MarketTypeCatalogRepository {
  loadAll() {
    return Promise.resolve([
      { externalMarketTypeId: 7, nameTemplate: 'European Handicap2(%s)' },
      { externalMarketTypeId: 17, nameTemplate: 'Asian Handicap1(%s)' },
    ]);
  }
}

const fakeConfig = {
  liveCurrentTtlSeconds: 10,
  prematchCurrentTtlSeconds: 20,
} as unknown as ConfigType<typeof betburgerConfig>;

describe('NormalizeBetburgerSurebetsUseCase', () => {
  function build() {
    return new NormalizeBetburgerSurebetsUseCase(
      new SurebetNormalizer(new MarketNameResolver()),
      new FakeBookmakerCatalog(),
      new FakeSportCatalog(),
      new FakeMarketTypeCatalog(),
      fakeConfig,
    );
  }

  it('loads the catalog and normalizes the response', async () => {
    const useCase = build();
    const fetchedAt = new Date('2026-05-24T03:31:50.840Z');

    const snapshot = await useCase.execute({
      type: 'LIVE',
      rawResponse: proSearchFixtureTwoLegs,
      fetchedAt,
    });

    expect(snapshot.total).toBe(1);
    expect(snapshot.surebets[0].legs[0].market.name).toBe(
      'European Handicap2(4.0)',
    );
    expect(snapshot.surebets[0].event.sportName).toBe('Baseball');
    expect(snapshot.expiresAt).toBe('2026-05-24T03:32:00.840Z');
  });

  it('uses the prematch ttl for PREMATCH', async () => {
    const useCase = build();
    const fetchedAt = new Date('2026-05-24T03:31:50.840Z');

    const snapshot = await useCase.execute({
      type: 'PREMATCH',
      rawResponse: { bets: [], arbs: [] },
      fetchedAt,
    });

    expect(snapshot.type).toBe('PREMATCH');
    expect(snapshot.snapshotId).toBe(`prematch-${fetchedAt.getTime()}`);
    expect(snapshot.expiresAt).toBe('2026-05-24T03:32:10.840Z');
  });
});
