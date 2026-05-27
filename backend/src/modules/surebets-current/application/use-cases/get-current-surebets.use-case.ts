import { Injectable } from '@nestjs/common';
import { CurrentSurebetsFilterService } from '../../domain/services/current-surebets-filter.service';
import { CurrentSurebetsPaginationService } from '../../domain/services/current-surebets-pagination.service';
import { CurrentSurebetsSortService } from '../../domain/services/current-surebets-sort.service';
import { CurrentSurebetsCacheRepository } from '../../infrastructure/cache/current-surebets-cache.repository';
import { GetCurrentSurebetsQuery } from '../contracts/get-current-surebets-query';
import { GetCurrentSurebetsResponse } from '../contracts/get-current-surebets-response';

/**
 * Reads the current snapshot from Redis and applies filter/sort/pagination in
 * memory. NEVER calls BetBurger, never writes Redis/Postgres.
 */
@Injectable()
export class GetCurrentSurebetsUseCase {
  constructor(
    private readonly currentCache: CurrentSurebetsCacheRepository,
    private readonly filterService: CurrentSurebetsFilterService,
    private readonly sortService: CurrentSurebetsSortService,
    private readonly paginationService: CurrentSurebetsPaginationService,
  ) {}

  async execute(
    query: GetCurrentSurebetsQuery,
  ): Promise<GetCurrentSurebetsResponse> {
    const snapshot = await this.currentCache.getCurrentSnapshot(query.type);

    if (!snapshot) {
      return {
        type: query.type,
        snapshotId: null,
        fetchedAt: null,
        expiresAt: null,
        isStale: true,
        total: 0,
        filteredTotal: 0,
        page: query.page,
        limit: query.limit,
        surebets: [],
        meta: { message: 'No current snapshot available' },
      };
    }

    const filtered = this.filterService.apply(snapshot.surebets, query);
    const sorted = this.sortService.apply(filtered, query.sort);
    const paged = this.paginationService.apply(sorted, query.page, query.limit);

    return {
      type: query.type,
      snapshotId: snapshot.snapshotId,
      fetchedAt: snapshot.fetchedAt,
      expiresAt: snapshot.expiresAt,
      isStale: snapshot.isStale,
      total: snapshot.total,
      filteredTotal: sorted.length,
      page: query.page,
      limit: query.limit,
      surebets: paged,
      meta: snapshot.meta,
    };
  }
}
