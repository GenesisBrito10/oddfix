export interface MarketTypeCatalogEntry {
  externalMarketTypeId: number;
  nameTemplate: string;
}

export abstract class MarketTypeCatalogRepository {
  abstract loadAll(): Promise<MarketTypeCatalogEntry[]>;
}
