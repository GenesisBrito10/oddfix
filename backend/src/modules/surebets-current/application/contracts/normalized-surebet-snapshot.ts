import { NormalizedSurebet } from './normalized-surebet';

export type SurebetType = 'LIVE' | 'PREMATCH';

export interface NormalizedSnapshotMeta {
  rawBets: number;
  rawArbs: number;
  normalized: number;
  skipped: number;
  missingBookmakers: number;
  missingMarkets: number;
  missingSports: number;
}

export interface NormalizedSurebetSnapshot {
  type: SurebetType;
  snapshotId: string;
  fetchedAt: string;
  expiresAt: string;
  isStale: boolean;
  total: number;
  surebets: NormalizedSurebet[];
  meta: NormalizedSnapshotMeta;
}
