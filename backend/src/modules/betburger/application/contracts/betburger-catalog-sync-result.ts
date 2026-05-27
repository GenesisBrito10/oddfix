export interface CatalogSyncCount {
  received: number;
  upserted: number;
}

export interface BookmakerSyncCount extends CatalogSyncCount {
  fallbacks: number;
}

export interface BetburgerCatalogSyncResult {
  bookmakers: BookmakerSyncCount;
  sports: CatalogSyncCount;
  marketTypes: CatalogSyncCount;
  syncedAt: string;
}
