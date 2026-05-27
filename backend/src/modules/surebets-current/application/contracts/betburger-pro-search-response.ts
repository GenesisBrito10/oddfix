/**
 * Raw BetBurger pro_search response shapes. Only the fields we consume are
 * typed; everything else is tolerated via the index signature. Most fields are
 * optional because BetBurger does not guarantee them.
 */
export interface BetburgerRawBet {
  id: string | number;
  event_id?: number | null;
  bookmaker_id?: number | null;
  bookmaker_event_name?: string | null;
  bookmaker_league_name?: string | null;
  event_name?: string | null;
  league_name?: string | null;
  league?: string | null;
  league_id?: number | null;
  sport_id?: number | null;
  team1_name?: string | null;
  team2_name?: string | null;
  home?: string | null;
  away?: string | null;
  koef?: number | string | null;
  market_and_bet_type?: number | null;
  market_and_bet_type_param?: number | string | null;
  period_identifier?: number | null;
  current_score?: string | null;
  is_live?: boolean | number | null;
  started_at?: number | null;
  scanned_at?: number | null;
  updated_at?: number | null;
  koef_last_modified_at?: number | null;
  [key: string]: unknown;
}

export interface BetburgerRawArb {
  arb_hash: string;
  event_id?: number | null;
  bet1_id?: string | number | null;
  bet2_id?: string | number | null;
  bet3_id?: string | number | null;
  percent?: number | string | null;
  roi?: number | string | null;
  arb_type?: string | null;
  min_koef?: number | string | null;
  max_koef?: number | string | null;
  created_at?: number | null;
  updated_at?: number | null;
  [key: string]: unknown;
}

export interface BetburgerProSearchResponse {
  bets?: BetburgerRawBet[];
  arbs?: BetburgerRawArb[];
  [key: string]: unknown;
}
