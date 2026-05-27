export interface SportCatalogEntry {
  externalSportId: number;
  name: string;
}

export abstract class SportCatalogRepository {
  abstract loadAll(): Promise<SportCatalogEntry[]>;
}
