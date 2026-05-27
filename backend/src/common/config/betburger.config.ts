import { registerAs } from '@nestjs/config';

/**
 * BetBurger integration config. Token is never logged. All values come from env;
 * defaults follow the safe rate-limit margins agreed for the project.
 * Consumed by the betburger / scheduler modules in later phases.
 */
export default registerAs('betburger', () => ({
  accessToken: process.env.BETBURGER_ACCESS_TOKEN ?? '',
  apiBaseUrl:
    process.env.BETBURGER_API_BASE_URL ?? 'https://api-lv.betburger.com/api/v1',
  restApiBaseUrl:
    process.env.BETBURGER_REST_API_BASE_URL ??
    'https://rest-api-lv.betburger.com/api/v1',

  // pro_search uses different hosts for live vs prematch.
  liveRestApiBaseUrl:
    process.env.BETBURGER_LIVE_REST_API_BASE_URL ??
    'https://rest-api-lv.betburger.com/api/v1',
  prematchRestApiBaseUrl:
    process.env.BETBURGER_PREMATCH_REST_API_BASE_URL ??
    'https://rest-api-pr.betburger.com/api/v1',

  // /search_filters is host-specific too: the live filter only exists on api-lv,
  // the prematch filter only on api-pr.
  liveApiBaseUrl:
    process.env.BETBURGER_LIVE_API_BASE_URL ??
    'https://api-lv.betburger.com/api/v1',
  prematchApiBaseUrl:
    process.env.BETBURGER_PREMATCH_API_BASE_URL ??
    'https://api-pr.betburger.com/api/v1',

  proSearchLocale: process.env.BETBURGER_PRO_SEARCH_LOCALE ?? 'en',
  proSearchPerPage: parseInt(
    process.env.BETBURGER_PRO_SEARCH_PER_PAGE ?? '10',
    10,
  ),

  liveSearchFilterId: process.env.BETBURGER_LIVE_SEARCH_FILTER_ID ?? '1741103',
  prematchSearchFilterId:
    process.env.BETBURGER_PREMATCH_SEARCH_FILTER_ID ?? '1149524',

  liveSyncIntervalMs: parseInt(
    process.env.BETBURGER_LIVE_SYNC_INTERVAL_MS ?? '3000',
    10,
  ),
  prematchSyncIntervalMs: parseInt(
    process.env.BETBURGER_PREMATCH_SYNC_INTERVAL_MS ?? '6000',
    10,
  ),

  liveLimitPerHour: parseInt(
    process.env.BETBURGER_LIVE_LIMIT_PER_HOUR ?? '1800',
    10,
  ),
  prematchLimitPerHour: parseInt(
    process.env.BETBURGER_PREMATCH_LIMIT_PER_HOUR ?? '700',
    10,
  ),

  liveCurrentTtlSeconds: parseInt(
    process.env.BETBURGER_LIVE_CURRENT_TTL_SECONDS ?? '10',
    10,
  ),
  liveSnapshotTtlSeconds: parseInt(
    process.env.BETBURGER_LIVE_SNAPSHOT_TTL_SECONDS ?? '60',
    10,
  ),
  prematchCurrentTtlSeconds: parseInt(
    process.env.BETBURGER_PREMATCH_CURRENT_TTL_SECONDS ?? '20',
    10,
  ),
  prematchSnapshotTtlSeconds: parseInt(
    process.env.BETBURGER_PREMATCH_SNAPSHOT_TTL_SECONDS ?? '120',
    10,
  ),

  liveOpeningProfitTtlSeconds: parseInt(
    process.env.BETBURGER_LIVE_OPENING_PROFIT_TTL_SECONDS ?? '600',
    10,
  ),
  prematchOpeningProfitTtlSeconds: parseInt(
    process.env.BETBURGER_PREMATCH_OPENING_PROFIT_TTL_SECONDS ?? '3600',
    10,
  ),

  liveRefreshLockTtlMs: parseInt(
    process.env.BETBURGER_LIVE_REFRESH_LOCK_TTL_MS ?? '2500',
    10,
  ),
  prematchRefreshLockTtlMs: parseInt(
    process.env.BETBURGER_PREMATCH_REFRESH_LOCK_TTL_MS ?? '5000',
    10,
  ),

  schedulerEnabled:
    (process.env.BETBURGER_SCHEDULER_ENABLED ?? 'false').toLowerCase() ===
    'true',

  httpTimeoutMs: parseInt(process.env.BETBURGER_HTTP_TIMEOUT_MS ?? '10000', 10),
}));
