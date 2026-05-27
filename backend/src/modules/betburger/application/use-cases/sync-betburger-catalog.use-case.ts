import { Injectable } from '@nestjs/common';
import {
  BookmakerCloneInput,
  BookmakerResolver,
  UserBookmakerInput,
} from '../../domain/services/bookmaker-resolver.service';
import { BookmakersRepository } from '../../domain/repositories/bookmakers.repository';
import {
  ResolvedSport,
  SportsRepository,
} from '../../domain/repositories/sports.repository';
import { MarketTypesRepository } from '../../domain/repositories/market-types.repository';
import { BetburgerHttpClient } from '../../infrastructure/http/betburger-http-client';
import { BETBURGER_MARKET_TYPES } from '../../infrastructure/static/betburger-market-types';
import { BetburgerCatalogSyncResult } from '../contracts/betburger-catalog-sync-result';

@Injectable()
export class SyncBetburgerCatalogUseCase {
  constructor(
    private readonly client: BetburgerHttpClient,
    private readonly bookmakerResolver: BookmakerResolver,
    private readonly bookmakersRepository: BookmakersRepository,
    private readonly sportsRepository: SportsRepository,
    private readonly marketTypesRepository: MarketTypesRepository,
  ) {}

  async execute(): Promise<BetburgerCatalogSyncResult> {
    const [userBookmakers, directories] = await Promise.all([
      this.client.getUserBookmakers(),
      this.client.getDirectories(),
    ]);

    // --- bookmakers ---
    const userBookmakerInputs: UserBookmakerInput[] = (
      userBookmakers.bookmakers ?? []
    ).map((bookmaker) => ({
      bookmakerId: bookmaker.bookmaker_id,
      cloneId: bookmaker.clone_id ?? null,
      active: this.normalizeActive(bookmaker.active),
      domain: bookmaker.domain ?? null,
      raw: bookmaker,
    }));

    const cloneInputs: BookmakerCloneInput[] = (
      directories.bookmaker_clones ?? []
    ).map((clone) => ({
      id: clone.id,
      name: clone.name,
      url: clone.url ?? null,
      raw: clone,
    }));

    const { bookmakers, fallbacks } = this.bookmakerResolver.resolve(
      userBookmakerInputs,
      cloneInputs,
    );
    const bookmakersUpserted =
      await this.bookmakersRepository.upsertMany(bookmakers);

    // --- sports ---
    const categoryNameById = new Map<number, string>();
    for (const category of directories.sport_categories ?? []) {
      categoryNameById.set(category.id, category.name);
    }

    const sports: ResolvedSport[] = (directories.sports ?? []).map((sport) => ({
      externalSportId: sport.id,
      name: sport.name,
      categoryId: sport.sport_category_id ?? null,
      categoryName:
        sport.sport_category_id != null
          ? (categoryNameById.get(sport.sport_category_id) ?? null)
          : null,
      rawJson: sport,
    }));
    const sportsUpserted = await this.sportsRepository.upsertMany(sports);

    // --- market types (static catalog) ---
    const marketTypes = BETBURGER_MARKET_TYPES.map((entry) => ({
      externalMarketTypeId: entry.id,
      nameTemplate: entry.nameTemplate,
    }));
    const marketTypesUpserted =
      await this.marketTypesRepository.upsertMany(marketTypes);

    return {
      bookmakers: {
        received: userBookmakerInputs.length,
        upserted: bookmakersUpserted,
        fallbacks,
      },
      sports: {
        received: sports.length,
        upserted: sportsUpserted,
      },
      marketTypes: {
        received: BETBURGER_MARKET_TYPES.length,
        upserted: marketTypesUpserted,
      },
      syncedAt: new Date().toISOString(),
    };
  }

  private normalizeActive(
    active: boolean | number | null | undefined,
  ): boolean {
    if (active === null || active === undefined) {
      return true;
    }
    if (typeof active === 'number') {
      return active !== 0;
    }
    return active;
  }
}
