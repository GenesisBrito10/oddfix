import { SurebetType } from '../../../surebets-current/application/contracts/normalized-surebet-snapshot';

export type RegisteredSurebetStatusValue =
  | 'PENDING'
  | 'GREEN'
  | 'RED'
  | 'VOID'
  | 'CANCELLED';

export type SurebetLegResultValue = RegisteredSurebetStatusValue;

/** Data needed to persist one leg of a registered surebet. */
export interface CreateRegisteredSurebetLegData {
  legIndex: number;
  externalBetId: string;
  externalBookmakerId: number | null;
  bookmakerName: string;
  bookmakerUrl: string | null;
  odd: number;
  marketTypeId: number | null;
  marketName: string;
  marketParam: number | null;
}

/** Data needed to persist a registered surebet + its legs (one transaction). */
export interface CreateRegisteredSurebetData {
  userId: string;
  arbHash: string;
  externalEventId: bigint;
  type: SurebetType;
  percent: number | null;
  arbType: string | null;
  minKoef: number | null;
  maxKoef: number | null;
  eventName: string;
  leagueName: string | null;
  sportId: number | null;
  sportName: string | null;
  team1Name: string | null;
  team2Name: string | null;
  currentScoreWhenRegistered: string | null;
  rawSnapshot: unknown;
  legs: CreateRegisteredSurebetLegData[];
}

/** Persisted leg as returned by the repository (Prisma-agnostic). */
export interface RegisteredSurebetLegRecord {
  id: string;
  legIndex: number;
  externalBetId: string;
  externalBookmakerId: number | null;
  bookmakerName: string;
  bookmakerUrl: string | null;
  odd: number;
  marketTypeId: number | null;
  marketName: string;
  marketParam: number | null;
  result: SurebetLegResultValue;
}

/** Persisted registered surebet as returned by the repository. */
export interface RegisteredSurebetRecord {
  id: string;
  userId: string;
  arbHash: string;
  externalEventId: bigint;
  type: SurebetType;
  percent: number | null;
  arbType: string | null;
  minKoef: number | null;
  maxKoef: number | null;
  eventName: string;
  leagueName: string | null;
  sportId: number | null;
  sportName: string | null;
  team1Name: string | null;
  team2Name: string | null;
  currentScoreWhenRegistered: string | null;
  status: RegisteredSurebetStatusValue;
  registeredAt: Date;
  updatedAt: Date;
  legs: RegisteredSurebetLegRecord[];
}

export type RegisteredSurebetSort =
  | 'registeredAt_desc'
  | 'registeredAt_asc'
  | 'percent_desc'
  | 'percent_asc';

/** Filters for listing a user's registered surebets (userId always required). */
export interface ListRegisteredSurebetsQuery {
  userId: string;
  status?: RegisteredSurebetStatusValue;
  type?: SurebetType;
  search?: string;
  sort: RegisteredSurebetSort;
  page: number;
  limit: number;
}

export interface ListRegisteredSurebetsResult {
  items: RegisteredSurebetRecord[];
  total: number;
}

/**
 * Port for persisting user-registered surebets. Abstract class doubles as the
 * DI token so the application layer depends on this contract, not on Prisma.
 * All read/update methods are scoped by userId to enforce ownership.
 */
export abstract class RegisteredSurebetsRepository {
  abstract create(
    data: CreateRegisteredSurebetData,
  ): Promise<RegisteredSurebetRecord>;

  abstract listByUser(
    query: ListRegisteredSurebetsQuery,
  ): Promise<ListRegisteredSurebetsResult>;

  abstract findByIdForUser(
    id: string,
    userId: string,
  ): Promise<RegisteredSurebetRecord | null>;

  /** Returns the updated record, or null when no row matched {id, userId}. */
  abstract updateStatus(
    id: string,
    userId: string,
    status: RegisteredSurebetStatusValue,
  ): Promise<RegisteredSurebetRecord | null>;

  /** Returns the updated record, or null when the leg/owner did not match. */
  abstract updateLegResult(
    id: string,
    legId: string,
    userId: string,
    result: SurebetLegResultValue,
  ): Promise<RegisteredSurebetRecord | null>;
}
