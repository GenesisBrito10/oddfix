import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../common/database/prisma.service';
import {
  ResolvedSport,
  SportsRepository,
} from '../../domain/repositories/sports.repository';

@Injectable()
export class PrismaSportsRepository extends SportsRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async upsertMany(sports: ResolvedSport[]): Promise<number> {
    let count = 0;
    for (const sport of sports) {
      const rawJson = (sport.rawJson ??
        Prisma.JsonNull) as Prisma.InputJsonValue;
      await this.prisma.sport.upsert({
        where: { externalSportId: sport.externalSportId },
        create: {
          externalSportId: sport.externalSportId,
          name: sport.name,
          categoryId: sport.categoryId,
          categoryName: sport.categoryName,
          rawJson,
        },
        update: {
          name: sport.name,
          categoryId: sport.categoryId,
          categoryName: sport.categoryName,
          rawJson,
        },
      });
      count += 1;
    }
    return count;
  }
}
