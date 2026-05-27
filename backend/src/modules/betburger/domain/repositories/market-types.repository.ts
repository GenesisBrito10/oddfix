export interface CatalogMarketType {
  externalMarketTypeId: number;
  nameTemplate: string;
}

export abstract class MarketTypesRepository {
  /** Idempotent upsert keyed by externalMarketTypeId. Returns rows written. */
  abstract upsertMany(marketTypes: CatalogMarketType[]): Promise<number>;
}
