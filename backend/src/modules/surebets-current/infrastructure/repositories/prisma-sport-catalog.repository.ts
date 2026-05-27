import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../common/database/prisma.service';
import {
  SportCatalogEntry,
  SportCatalogRepository,
} from '../../domain/repositories/sport-catalog.repository';

@Injectable()
export class PrismaSportCatalogRepository extends SportCatalogRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async loadAll(): Promise<SportCatalogEntry[]> {
    return this.prisma.sport.findMany({
      select: { externalSportId: true, name: true },
    });
  }
}
