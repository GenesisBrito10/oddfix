export type BetburgerType = 'LIVE' | 'PREMATCH';

export interface BetburgerRateLimitResult {
  allowed: boolean;
  current: number;
  limit: number;
  resetAt: Date;
}

export interface BetburgerLockResult {
  acquired: boolean;
  token?: string;
}

export type BetburgerIntegrationStatusName =
  | 'IDLE'
  | 'REFRESHING'
  | 'SUCCESS'
  | 'ERROR'
  | 'RATE_LIMITED'
  | 'STALE';

export interface BetburgerIntegrationStatus {
  type: BetburgerType;
  status: BetburgerIntegrationStatusName;
  lastSuccessAt: string | null;
  lastErrorAt: string | null;
  nextAttemptAt: string | null;
  lastSnapshotId: string | null;
  message: string | null;
}
