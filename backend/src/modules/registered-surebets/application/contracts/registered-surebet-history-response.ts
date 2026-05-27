import {
  RegisteredSurebetStatusValue,
  SurebetLegResultValue,
} from '../../domain/repositories/registered-surebets.repository';
import { SurebetType } from '../../../surebets-current/application/contracts/normalized-surebet-snapshot';

export interface RegisteredSurebetHistoryLeg {
  id: string;
  legIndex: number;
  bookmakerName: string;
  bookmakerUrl: string | null;
  odd: number;
  marketName: string;
  result: SurebetLegResultValue;
}

/**
 * A single history item. externalEventId is a string; dates are ISO strings.
 * rawSnapshot is intentionally omitted (not exposed to normal users).
 */
export interface RegisteredSurebetHistoryItem {
  id: string;
  arbHash: string;
  externalEventId: string;
  type: SurebetType;
  percent: number | null;
  arbType: string | null;
  minKoef: number | null;
  maxKoef: number | null;
  eventName: string;
  leagueName: string | null;
  sportName: string | null;
  team1Name: string | null;
  team2Name: string | null;
  currentScoreWhenRegistered: string | null;
  status: RegisteredSurebetStatusValue;
  registeredAt: string;
  updatedAt: string;
  legs: RegisteredSurebetHistoryLeg[];
}

export interface RegisteredSurebetHistoryPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface RegisteredSurebetHistoryListResponse {
  items: RegisteredSurebetHistoryItem[];
  pagination: RegisteredSurebetHistoryPagination;
}
