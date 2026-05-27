/**
 * A single saved search filter from GET /search_filters. Only the fields we use
 * are typed; bookmakers1/bookmakers2 are the bk_ids (as strings) to query.
 */
export interface BetburgerSearchFilter {
  id: number;
  bookmakers1?: string[];
  bookmakers2?: string[];
}

export type BetburgerSearchFiltersResponse = BetburgerSearchFilter[];
