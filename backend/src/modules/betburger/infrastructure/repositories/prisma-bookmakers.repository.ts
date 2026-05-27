import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../common/database/prisma.service';
import {
  ActiveBookmaker,
  BookmakersRepository,
  ResolvedBookmaker,
} from '../../domain/repositories/bookmakers.repository';

@Injectable()
export class PrismaBookmakersRepository extends BookmakersRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async upsertMany(bookmakers: ResolvedBookmaker[]): Promise<number> {
    let count = 0;
    for (const bookmaker of bookmakers) {
      const rawJson = (bookmaker.rawJson ??
        Prisma.JsonNull) as Prisma.InputJsonValue;
      await this.prisma.bookmaker.upsert({
        where: { externalBookmakerId: bookmaker.externalBookmakerId },
        create: {
          externalBookmakerId: bookmaker.externalBookmakerId,
          cloneId: bookmaker.cloneId,
          name: bookmaker.name,
          url: bookmaker.url,
          domain: bookmaker.domain,
          active: bookmaker.active,
          rawJson,
        },
        update: {
          cloneId: bookmaker.cloneId,
          name: bookmaker.name,
          url: bookmaker.url,
          domain: bookmaker.domain,
          active: bookmaker.active,
          rawJson,
        },
      });
      count += 1;
    }
    return count;
  }

  async findByExternalBookmakerId(
    externalBookmakerId: number,
  ): Promise<ResolvedBookmaker | null> {
    const row = await this.prisma.bookmaker.findUnique({
      where: { externalBookmakerId },
    });
    if (!row) {
      return null;
    }
    return {
      externalBookmakerId: row.externalBookmakerId,
      cloneId: row.cloneId,
      name: row.name,
      url: row.url,
      domain: row.domain,
      active: row.active,
      rawJson: row.rawJson,
    };
  }

  async findActive(): Promise<ActiveBookmaker[]> {
    return this.prisma.bookmaker.findMany({
      where: { active: true },
      select: { externalBookmakerId: true, name: true },
      orderBy: { name: 'asc' },
    });
  }
}
