/** A bookmaker resolved from the BetBurger catalog, ready to persist. */
export interface ResolvedBookmaker {
  externalBookmakerId: number;
  cloneId: number | null;
  name: string;
  url: string | null;
  domain: string | null;
  active: boolean;
  rawJson: unknown;
}

/** Minimal bookmaker for the frontend filter list. */
export interface ActiveBookmaker {
  externalBookmakerId: number;
  name: string;
}

export abstract class BookmakersRepository {
  /** Idempotent upsert keyed by externalBookmakerId. Returns rows written. */
  abstract upsertMany(bookmakers: ResolvedBookmaker[]): Promise<number>;
  abstract findByExternalBookmakerId(
    externalBookmakerId: number,
  ): Promise<ResolvedBookmaker | null>;
  /** Active bookmakers (id + name), ordered by name — for the frontend filter. */
  abstract findActive(): Promise<ActiveBookmaker[]>;
}
