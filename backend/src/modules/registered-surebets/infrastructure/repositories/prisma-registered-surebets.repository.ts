import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../../common/database/prisma.service';
import {
  CreateRegisteredSurebetData,
  ListRegisteredSurebetsQuery,
  ListRegisteredSurebetsResult,
  RegisteredSurebetRecord,
  RegisteredSurebetSort,
  RegisteredSurebetStatusValue,
  RegisteredSurebetsRepository,
  SurebetLegResultValue,
} from '../../domain/repositories/registered-surebets.repository';
import { RegisteredSurebetMapper } from '../mappers/registered-surebet.mapper';

@Injectable()
export class PrismaRegisteredSurebetsRepository extends RegisteredSurebetsRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(
    data: CreateRegisteredSurebetData,
  ): Promise<RegisteredSurebetRecord> {
    const row = await this.prisma.$transaction((tx) =>
      tx.registeredSurebet.create({
        data: {
          userId: data.userId,
          arbHash: data.arbHash,
          externalEventId: data.externalEventId,
          type: data.type,
          percent: data.percent,
          arbType: data.arbType,
          minKoef: data.minKoef,
          maxKoef: data.maxKoef,
          eventName: data.eventName,
          leagueName: data.leagueName,
          sportId: data.sportId,
          sportName: data.sportName,
          team1Name: data.team1Name,
          team2Name: data.team2Name,
          currentScoreWhenRegistered: data.currentScoreWhenRegistered,
          rawSnapshot: data.rawSnapshot as Prisma.InputJsonValue,
          legs: {
            create: data.legs.map((leg) => ({
              legIndex: leg.legIndex,
              externalBetId: leg.externalBetId,
              externalBookmakerId: leg.externalBookmakerId,
              bookmakerName: leg.bookmakerName,
              bookmakerUrl: leg.bookmakerUrl,
              odd: leg.odd,
              marketTypeId: leg.marketTypeId,
              marketName: leg.marketName,
              marketParam: leg.marketParam,
            })),
          },
        },
        include: { legs: true },
      }),
    );

    return RegisteredSurebetMapper.toRecord(row);
  }

  async listByUser(
    query: ListRegisteredSurebetsQuery,
  ): Promise<ListRegisteredSurebetsResult> {
    const where = this.buildWhere(query);
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.registeredSurebet.findMany({
        where,
        orderBy: this.orderBy(query.sort),
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        include: { legs: true },
      }),
      this.prisma.registeredSurebet.count({ where }),
    ]);
    return {
      items: rows.map((row) => RegisteredSurebetMapper.toRecord(row)),
      total,
    };
  }

  async findByIdForUser(
    id: string,
    userId: string,
  ): Promise<RegisteredSurebetRecord | null> {
    const row = await this.prisma.registeredSurebet.findFirst({
      where: { id, userId },
      include: { legs: true },
    });
    return row ? RegisteredSurebetMapper.toRecord(row) : null;
  }

  async updateStatus(
    id: string,
    userId: string,
    status: RegisteredSurebetStatusValue,
  ): Promise<RegisteredSurebetRecord | null> {
    // updateMany scoped by {id, userId} enforces ownership without a prior read.
    const updated = await this.prisma.registeredSurebet.updateMany({
      where: { id, userId },
      data: { status },
    });
    if (updated.count === 0) {
      return null;
    }
    return this.findByIdForUser(id, userId);
  }

  async updateLegResult(
    id: string,
    legId: string,
    userId: string,
    result: SurebetLegResultValue,
  ): Promise<RegisteredSurebetRecord | null> {
    const updated = await this.prisma.registeredSurebetLeg.updateMany({
      where: { id: legId, registeredSurebet: { id, userId } },
      data: { result },
    });
    if (updated.count === 0) {
      return null;
    }
    return this.findByIdForUser(id, userId);
  }

  private buildWhere(
    query: ListRegisteredSurebetsQuery,
  ): Prisma.RegisteredSurebetWhereInput {
    const where: Prisma.RegisteredSurebetWhereInput = { userId: query.userId };
    if (query.status) {
      where.status = query.status;
    }
    if (query.type) {
      where.type = query.type;
    }
    const search = query.search?.trim();
    if (search) {
      where.OR = [
        { eventName: { contains: search, mode: 'insensitive' } },
        { leagueName: { contains: search, mode: 'insensitive' } },
        { sportName: { contains: search, mode: 'insensitive' } },
        {
          legs: {
            some: { bookmakerName: { contains: search, mode: 'insensitive' } },
          },
        },
        {
          legs: {
            some: { marketName: { contains: search, mode: 'insensitive' } },
          },
        },
      ];
    }
    return where;
  }

  private orderBy(
    sort: RegisteredSurebetSort,
  ): Prisma.RegisteredSurebetOrderByWithRelationInput {
    switch (sort) {
      case 'registeredAt_asc':
        return { registeredAt: 'asc' };
      case 'percent_desc':
        return { percent: 'desc' };
      case 'percent_asc':
        return { percent: 'asc' };
      case 'registeredAt_desc':
      default:
        return { registeredAt: 'desc' };
    }
  }
}
