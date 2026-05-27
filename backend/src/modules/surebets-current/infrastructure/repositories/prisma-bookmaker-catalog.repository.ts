import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../common/database/prisma.service';
import {
  BookmakerCatalogEntry,
  BookmakerCatalogRepository,
} from '../../domain/repositories/bookmaker-catalog.repository';

@Injectable()
export class PrismaBookmakerCatalogRepository extends BookmakerCatalogRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async loadAll(): Promise<BookmakerCatalogEntry[]> {
    return this.prisma.bookmaker.findMany({
      select: { externalBookmakerId: true, name: true, url: true },
    });
  }
}
