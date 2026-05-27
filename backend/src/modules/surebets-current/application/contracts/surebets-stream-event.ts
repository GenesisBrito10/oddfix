import { NormalizedSurebet } from './normalized-surebet';
import {
  NormalizedSnapshotMeta,
  NormalizedSurebetSnapshot,
  SurebetType,
} from './normalized-surebet-snapshot';

/** Redis pub/sub channel a refresh publishes to when it writes a new snapshot. */
export function surebetsUpdatedChannel(type: SurebetType): string {
  return `surebets:updated:${type.toLowerCase()}`;
}

/**
 * SSE event payload. Unfiltered/unpaginated full snapshot — the frontend
 * applies its own filter/sort (same as it does for the REST response).
 */
export interface SurebetsStreamPayload {
  type: SurebetType;
  snapshotId: string;
  fetchedAt: string;
  expiresAt: string;
  isStale: boolean;
  total: number;
  surebets: NormalizedSurebet[];
  meta: NormalizedSnapshotMeta;
}

export function toStreamPayload(
  snapshot: NormalizedSurebetSnapshot,
): SurebetsStreamPayload {
  return {
    type: snapshot.type,
    snapshotId: snapshot.snapshotId,
    fetchedAt: snapshot.fetchedAt,
    expiresAt: snapshot.expiresAt,
    isStale: snapshot.isStale,
    total: snapshot.total,
    surebets: snapshot.surebets,
    meta: snapshot.meta,
  };
}
