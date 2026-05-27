export interface ResolvedSport {
  externalSportId: number;
  name: string;
  categoryId: number | null;
  categoryName: string | null;
  rawJson: unknown;
}

export abstract class SportsRepository {
  /** Idempotent upsert keyed by externalSportId. Returns rows written. */
  abstract upsertMany(sports: ResolvedSport[]): Promise<number>;
}
