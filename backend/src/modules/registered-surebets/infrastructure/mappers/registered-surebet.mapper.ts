import {
  Prisma,
  RegisteredSurebet as PrismaRegisteredSurebet,
  RegisteredSurebetLeg as PrismaRegisteredSurebetLeg,
} from '@prisma/client';
import {
  RegisteredSurebetLegRecord,
  RegisteredSurebetRecord,
} from '../../domain/repositories/registered-surebets.repository';

type PrismaRowWithLegs = PrismaRegisteredSurebet & {
  legs: PrismaRegisteredSurebetLeg[];
};

const toNumber = (value: Prisma.Decimal | null): number | null =>
  value === null ? null : value.toNumber();

/** Translates the Prisma row (Decimal/BigInt) into the Prisma-agnostic record. */
export class RegisteredSurebetMapper {
  static toRecord(row: PrismaRowWithLegs): RegisteredSurebetRecord {
    return {
      id: row.id,
      userId: row.userId,
      arbHash: row.arbHash,
      externalEventId: row.externalEventId,
      type: row.type,
      percent: toNumber(row.percent),
      arbType: row.arbType,
      minKoef: toNumber(row.minKoef),
      maxKoef: toNumber(row.maxKoef),
      eventName: row.eventName,
      leagueName: row.leagueName,
      sportId: row.sportId,
      sportName: row.sportName,
      team1Name: row.team1Name,
      team2Name: row.team2Name,
      currentScoreWhenRegistered: row.currentScoreWhenRegistered,
      status: row.status,
      registeredAt: row.registeredAt,
      updatedAt: row.updatedAt,
      legs: row.legs.map(
        (leg): RegisteredSurebetLegRecord => ({
          id: leg.id,
          legIndex: leg.legIndex,
          externalBetId: leg.externalBetId,
          externalBookmakerId: leg.externalBookmakerId,
          bookmakerName: leg.bookmakerName,
          bookmakerUrl: leg.bookmakerUrl,
          odd: leg.odd.toNumber(),
          marketTypeId: leg.marketTypeId,
          marketName: leg.marketName,
          marketParam: toNumber(leg.marketParam),
          result: leg.result,
        }),
      ),
    };
  }
}
