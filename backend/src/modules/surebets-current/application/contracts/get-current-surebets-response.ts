import { NormalizedSurebet } from './normalized-surebet';
import {
  NormalizedSnapshotMeta,
  SurebetType,
} from './normalized-surebet-snapshot';

export interface GetCurrentSurebetsResponse {
  type: SurebetType;
  snapshotId: string | null;
  fetchedAt: string | null;
  expiresAt: string | null;
  isStale: boolean;
  total: number;
  filteredTotal: number;
  page: number;
  limit: number;
  surebets: NormalizedSurebet[];
  meta: NormalizedSnapshotMeta | { message: string };
}
