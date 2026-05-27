export interface BookmakerCatalogEntry {
  externalBookmakerId: number;
  name: string;
  url: string | null;
}

/** Read-only catalog port used by the normalizer use-case. */
export abstract class BookmakerCatalogRepository {
  abstract loadAll(): Promise<BookmakerCatalogEntry[]>;
}
