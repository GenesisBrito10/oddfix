import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import betburgerConfig from '../../../../common/config/betburger.config';
import { BookmakerCatalogRepository } from '../../domain/repositories/bookmaker-catalog.repository';
import { MarketTypeCatalogRepository } from '../../domain/repositories/market-type-catalog.repository';
import { SportCatalogRepository } from '../../domain/repositories/sport-catalog.repository';
import {
  NormalizationCatalog,
  SurebetNormalizer,
} from '../../domain/services/surebet-normalizer.service';
import { BetburgerProSearchResponse } from '../contracts/betburger-pro-search-response';
import {
  NormalizedSurebetSnapshot,
  SurebetType,
} from '../contracts/normalized-surebet-snapshot';

export interface NormalizeBetburgerSurebetsInput {
  type: SurebetType;
  rawResponse: BetburgerProSearchResponse;
  fetchedAt?: Date;
  currentSnapshotTtlSeconds?: number;
}

@Injectable()
export class NormalizeBetburgerSurebetsUseCase {
  constructor(
    private readonly normalizer: SurebetNormalizer,
    private readonly bookmakerCatalogRepository: BookmakerCatalogRepository,
    private readonly sportCatalogRepository: SportCatalogRepository,
    private readonly marketTypeCatalogRepository: MarketTypeCatalogRepository,
    @Inject(betburgerConfig.KEY)
    private readonly config: ConfigType<typeof betburgerConfig>,
  ) {}

  async execute(
    input: NormalizeBetburgerSurebetsInput,
  ): Promise<NormalizedSurebetSnapshot> {
    const [bookmakers, sports, marketTypes] = await Promise.all([
      this.bookmakerCatalogRepository.loadAll(),
      this.sportCatalogRepository.loadAll(),
      this.marketTypeCatalogRepository.loadAll(),
    ]);

    const catalog: NormalizationCatalog = {
      bookmakersById: new Map(
        bookmakers.map((b) => [
          b.externalBookmakerId,
          { name: b.name, url: b.url },
        ]),
      ),
      sportsById: new Map(sports.map((s) => [s.externalSportId, s.name])),
      marketTemplatesById: new Map(
        marketTypes.map((m) => [m.externalMarketTypeId, m.nameTemplate]),
      ),
    };

    return this.normalizer.normalize({
      type: input.type,
      rawResponse: input.rawResponse,
      fetchedAt: input.fetchedAt ?? new Date(),
      currentSnapshotTtlSeconds:
        input.currentSnapshotTtlSeconds ?? this.defaultTtl(input.type),
      catalog,
    });
  }

  private defaultTtl(type: SurebetType): number {
    return type === 'LIVE'
      ? this.config.liveCurrentTtlSeconds
      : this.config.prematchCurrentTtlSeconds;
  }
}
