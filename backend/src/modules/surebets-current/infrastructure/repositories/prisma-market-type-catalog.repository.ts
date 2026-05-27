import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../common/database/prisma.service';
import {
  MarketTypeCatalogEntry,
  MarketTypeCatalogRepository,
} from '../../domain/repositories/market-type-catalog.repository';

@Injectable()
export class PrismaMarketTypeCatalogRepository extends MarketTypeCatalogRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async loadAll(): Promise<MarketTypeCatalogEntry[]> {
    return this.prisma.marketType.findMany({
      select: { externalMarketTypeId: true, nameTemplate: true },
    });
  }
}
