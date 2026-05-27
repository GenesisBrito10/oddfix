import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import betburgerConfig from '../../../../common/config/betburger.config';
import { RedisService } from '../../../../common/redis/redis.service';
import {
  BookmakerCloneInput,
  BookmakerResolver,
  UserBookmakerInput,
} from '../../domain/services/bookmaker-resolver.service';
import { ActiveBookmaker } from '../../domain/repositories/bookmakers.repository';
import { BetburgerHttpClient } from '../../infrastructure/http/betburger-http-client';

/** Redis key holding the menu bookmakers (temporary; overwritten on each start). */
export const MENU_BOOKMAKERS_KEY = 'catalog:menu:bookmakers';

export interface RefreshMenuBookmakersResult {
  count: number;
  wantedBookmakerIds: number[];
  menu: ActiveBookmaker[];
}

/**
 * Builds the "Casas de Apostas" menu list = the bookmakers in the live + prematch
 * search filters (bookmakers1 ∪ bookmakers2), resolved to names, and stores it
 * in Redis (NOT Postgres — it can change, so it's re-fetched and overwritten on
 * every start). Never called from a public endpoint.
 */
@Injectable()
export class RefreshMenuBookmakersUseCase {
  constructor(
    private readonly client: BetburgerHttpClient,
    private readonly resolver: BookmakerResolver,
    private readonly redis: RedisService,
    @Inject(betburgerConfig.KEY)
    private readonly config: ConfigType<typeof betburgerConfig>,
  ) {}

  async execute(): Promise<RefreshMenuBookmakersResult> {
    const [liveFilters, prematchFilters, userBookmakers, directories] =
      await Promise.all([
        this.client.getSearchFilters('LIVE'),
        this.client.getSearchFilters('PREMATCH'),
        this.client.getUserBookmakers(),
        this.client.getDirectories(),
      ]);

    const wanted = new Set<number>([
      ...this.filterBkIds(liveFilters, this.config.liveSearchFilterId),
      ...this.filterBkIds(prematchFilters, this.config.prematchSearchFilterId),
    ]);
    const wantedBookmakerIds = Array.from(wanted).sort((a, b) => a - b);

    const userBookmakerInputs: UserBookmakerInput[] = (
      userBookmakers.bookmakers ?? []
    ).map((bookmaker) => ({
      bookmakerId: bookmaker.bookmaker_id,
      cloneId: bookmaker.clone_id ?? null,
      active: true,
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

    const { bookmakers } = this.resolver.resolve(
      userBookmakerInputs,
      cloneInputs,
    );

    const menu: ActiveBookmaker[] = bookmakers
      .filter((b) => wanted.has(b.externalBookmakerId))
      .map((b) => ({
        externalBookmakerId: b.externalBookmakerId,
        name: b.name,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    await this.redis.set(MENU_BOOKMAKERS_KEY, JSON.stringify(menu));
    return { count: menu.length, wantedBookmakerIds, menu };
  }

  private filterBkIds(
    filters: { id: number; bookmakers1?: string[]; bookmakers2?: string[] }[],
    filterId: string,
  ): number[] {
    const filter = filters.find((f) => String(f.id) === filterId);
    return [...(filter?.bookmakers1 ?? []), ...(filter?.bookmakers2 ?? [])]
      .map((id) => Number(id))
      .filter((id) => Number.isFinite(id));
  }
}
