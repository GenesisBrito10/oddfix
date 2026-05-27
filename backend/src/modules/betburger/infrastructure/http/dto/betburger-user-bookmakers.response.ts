/** Raw shape of GET /user_bookmakers (only the fields we consume are typed). */
export interface BetburgerUserBookmaker {
  bookmaker_id: number;
  clone_id?: number | null;
  active?: boolean | number | null;
  domain?: string | null;
  [key: string]: unknown;
}

export interface BetburgerUserBookmakersResponse {
  bookmakers?: BetburgerUserBookmaker[];
  [key: string]: unknown;
}
