import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../common/database/prisma.service';
import {
  CatalogMarketType,
  MarketTypesRepository,
} from '../../domain/repositories/market-types.repository';

@Injectable()
export class PrismaMarketTypesRepository extends MarketTypesRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async upsertMany(marketTypes: CatalogMarketType[]): Promise<number> {
    let count = 0;
    for (const marketType of marketTypes) {
      await this.prisma.marketType.upsert({
        where: { externalMarketTypeId: marketType.externalMarketTypeId },
        create: {
          externalMarketTypeId: marketType.externalMarketTypeId,
          nameTemplate: marketType.nameTemplate,
        },
        update: {
          nameTemplate: marketType.nameTemplate,
        },
      });
      count += 1;
    }
    return count;
  }
}
