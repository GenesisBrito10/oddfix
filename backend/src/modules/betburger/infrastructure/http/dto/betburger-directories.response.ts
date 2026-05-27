/** Raw shape of GET /directories (only the fields we consume are typed). */
export interface BetburgerBookmakerClone {
  id: number;
  name: string;
  url?: string | null;
  bookmaker_id?: number | null;
  active?: boolean | number | null;
  [key: string]: unknown;
}

export interface BetburgerSport {
  id: number;
  name: string;
  sport_category_id?: number | null;
  [key: string]: unknown;
}

export interface BetburgerSportCategory {
  id: number;
  name: string;
  slug?: string;
  [key: string]: unknown;
}

export interface BetburgerDirectoriesResponse {
  bookmaker_clones?: BetburgerBookmakerClone[];
  sports?: BetburgerSport[];
  sport_categories?: BetburgerSportCategory[];
  [key: string]: unknown;
}
