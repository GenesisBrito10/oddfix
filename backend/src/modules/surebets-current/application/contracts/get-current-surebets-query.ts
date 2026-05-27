import { SurebetType } from './normalized-surebet-snapshot';

export type CurrentSurebetsSort = 'profit' | 'recent' | 'start';

/** Normalized query (already parsed from the HTTP DTO). */
export interface GetCurrentSurebetsQuery {
  type: SurebetType;
  search?: string;
  minPercent?: number;
  maxPercent?: number;
  bookmakers?: string[];
  sports?: string[];
  legs?: number;
  sort?: CurrentSurebetsSort;
  page: number;
  limit: number;
}
