import { Inject, Injectable } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import betburgerConfig from '../../../../common/config/betburger.config';
import {
  BETBURGER_EVENT_ARB_TYPES,
  getBetburgerProSearchTargets,
} from '../static/betburger-pro-search-payload.config';
import { BetburgerDirectoriesResponse } from './dto/betburger-directories.response';
import { BetburgerProSearchResponse } from './dto/betburger-pro-search.response';
import { BetburgerSearchFiltersResponse } from './dto/betburger-search-filters.response';
import { BetburgerUserBookmakersResponse } from './dto/betburger-user-bookmakers.response';

const PRO_SEARCH_USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36';

/** Error that should not be retried (e.g. 4xx). */
class NonRetryableHttpError extends Error {}

/**
 * Thin BetBurger HTTP client. The access token is taken from env, injected as a
 * query param, and NEVER logged or embedded in error messages (errors reference
 * only the request path). Retries transient failures (network/timeout/5xx) a
 * bounded number of times; never retries 4xx.
 */
@Injectable()
export class BetburgerHttpClient {
  private readonly maxRetries = 2;
  private readonly searchFiltersTtlMs = 60_000;
  private readonly searchFiltersCache = new Map<
    'LIVE' | 'PREMATCH',
    { at: number; data: BetburgerSearchFiltersResponse }
  >();

  constructor(
    @Inject(betburgerConfig.KEY)
    private readonly config: ConfigType<typeof betburgerConfig>,
  ) {}

  getUserBookmakers(): Promise<BetburgerUserBookmakersResponse> {
    return this.get<BetburgerUserBookmakersResponse>('/user_bookmakers');
  }

  getDirectories(): Promise<BetburgerDirectoriesResponse> {
    return this.get<BetburgerDirectoriesResponse>('/directories');
  }

  getSearchFilters(
    type: 'LIVE' | 'PREMATCH',
  ): Promise<BetburgerSearchFiltersResponse> {
    // Host-specific: the live filter only exists on api-lv, prematch on api-pr.
    const baseUrl =
      type === 'LIVE'
        ? this.config.liveApiBaseUrl
        : this.config.prematchApiBaseUrl;
    return this.get<BetburgerSearchFiltersResponse>('/search_filters', baseUrl);
  }

  /**
   * pro_search live/prematch. Live and prematch use different hosts, search
   * filters and bk_ids — never just toggle is_live. The synchronous token check
   * is kept here so a missing token throws immediately.
   */
  getProSearch(type: 'LIVE' | 'PREMATCH'): Promise<BetburgerProSearchResponse> {
    const token = this.config.accessToken;
    if (!token) {
      throw new Error('BETBURGER_ACCESS_TOKEN is not configured');
    }
    return this.executeProSearch(type, token);
  }

  private async executeProSearch(
    type: 'LIVE' | 'PREMATCH',
    token: string,
  ): Promise<BetburgerProSearchResponse> {
    const baseUrl =
      type === 'LIVE'
        ? this.config.liveRestApiBaseUrl
        : this.config.prematchRestApiBaseUrl;
    const searchFilterId =
      type === 'LIVE'
        ? this.config.liveSearchFilterId
        : this.config.prematchSearchFilterId;
    const { isLive } = getBetburgerProSearchTargets(type);
    // bk_ids come from the search filter's bookmakers1 ∪ bookmakers2.
    const bkIds = await this.resolveBkIds(type, searchFilterId);

    const url = new URL(`${baseUrl}/arbs/pro_search`);
    url.searchParams.set('access_token', token);
    url.searchParams.set('locale', this.config.proSearchLocale);

    const body = this.buildProSearchBody(isLive, searchFilterId, bkIds);

    return this.fetchWithRetry<BetburgerProSearchResponse>(
      url,
      '/arbs/pro_search',
      {
        method: 'POST',
        headers: {
          accept: 'application/json, text/plain, */*',
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
          origin: 'https://www.betburger.com',
          referer: 'https://www.betburger.com/',
          'user-agent': PRO_SEARCH_USER_AGENT,
        },
        body: body.toString(),
      },
    );
  }

  /**
   * The bk_ids passed to pro_search are exactly the bookmakers1 ∪ bookmakers2 of
   * the configured search filter (fetched from /search_filters, cached briefly).
   * Falls back to the static curated list if the filter can't be read.
   */
  private async resolveBkIds(
    type: 'LIVE' | 'PREMATCH',
    searchFilterId: string,
  ): Promise<readonly number[]> {
    try {
      const filters = await this.cachedSearchFilters(type);
      const filter = filters.find((f) => String(f.id) === searchFilterId);
      const ids = [
        ...(filter?.bookmakers1 ?? []),
        ...(filter?.bookmakers2 ?? []),
      ]
        .map((id) => Number(id))
        .filter((id) => Number.isFinite(id));
      if (ids.length > 0) {
        return Array.from(new Set(ids));
      }
    } catch {
      // fall through to the static fallback below
    }
    return getBetburgerProSearchTargets(type).bkIds;
  }

  private async cachedSearchFilters(
    type: 'LIVE' | 'PREMATCH',
  ): Promise<BetburgerSearchFiltersResponse> {
    const now = Date.now();
    const cached = this.searchFiltersCache.get(type);
    if (cached && now - cached.at < this.searchFiltersTtlMs) {
      return cached.data;
    }
    const data = await this.getSearchFilters(type);
    this.searchFiltersCache.set(type, { at: now, data });
    return data;
  }

  private buildProSearchBody(
    isLive: boolean,
    searchFilterId: string,
    bkIds: readonly number[],
  ): URLSearchParams {
    const params = new URLSearchParams();
    params.set('auto_update', 'true');
    params.set('notification_sound', 'false');
    params.set('notification_popup', 'false');
    params.set('show_event_arbs', 'true');
    params.set('grouped', 'true');
    params.set('per_page', String(this.config.proSearchPerPage));
    params.set('sort_by', 'percent');
    params.set('koef_format', 'decimal');
    params.set('mode', '');
    params.set('event_id', '');
    params.set('q', '');
    for (const arbType of BETBURGER_EVENT_ARB_TYPES) {
      params.append('event_arb_types[]', String(arbType));
    }
    params.append('search_filter[]', searchFilterId);
    params.set('is_live', String(isLive));
    for (const id of bkIds) {
      params.append('bk_ids[]', String(id));
    }
    return params;
  }

  private get<T>(
    path: string,
    baseUrl: string = this.config.apiBaseUrl,
  ): Promise<T> {
    const token = this.config.accessToken;
    if (!token) {
      throw new Error('BETBURGER_ACCESS_TOKEN is not configured');
    }

    const url = new URL(`${baseUrl}${path}`);
    url.searchParams.set('access_token', token);
    url.searchParams.set('locale', 'en');

    return this.fetchWithRetry<T>(url, path);
  }

  private async fetchWithRetry<T>(
    url: URL,
    safePath: string,
    init: RequestInit = {},
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= this.maxRetries; attempt += 1) {
      try {
        return await this.requestOnce<T>(url, safePath, init);
      } catch (error: unknown) {
        if (error instanceof NonRetryableHttpError) {
          throw error;
        }
        lastError = error instanceof Error ? error : new Error(String(error));
      }

      if (attempt < this.maxRetries) {
        await this.delay((attempt + 1) * 300);
      }
    }

    throw new Error(
      `BetBurger request to ${safePath} failed after ${this.maxRetries + 1} attempts: ${
        lastError?.message ?? 'unknown error'
      }`,
    );
  }

  private async requestOnce<T>(
    url: URL,
    safePath: string,
    init: RequestInit,
  ): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(
      () => controller.abort(),
      this.config.httpTimeoutMs,
    );

    try {
      const response = await fetch(url, { ...init, signal: controller.signal });

      if (response.ok) {
        return (await response.json()) as T;
      }

      const message = `BetBurger request to ${safePath} failed with status ${response.status}`;
      if (response.status >= 400 && response.status < 500) {
        throw new NonRetryableHttpError(message);
      }
      throw new Error(message);
    } finally {
      clearTimeout(timer);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
