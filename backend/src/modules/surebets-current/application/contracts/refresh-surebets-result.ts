import { SurebetType } from './normalized-surebet-snapshot';

export type RefreshStatus =
  | 'SUCCESS'
  | 'SKIPPED_LOCKED'
  | 'RATE_LIMITED'
  | 'ERROR';

export interface RefreshSurebetsResult {
  type: SurebetType;
  status: RefreshStatus;
  snapshotId?: string;
  rawBets?: number;
  rawArbs?: number;
  normalized?: number;
  skipped?: number;
  missingBookmakers?: number;
  missingMarkets?: number;
  missingSports?: number;
  fetchedAt?: string;
  expiresAt?: string;
  message?: string;
  rateLimit?: {
    current: number;
    limit: number;
    resetAt: string;
  };
}
