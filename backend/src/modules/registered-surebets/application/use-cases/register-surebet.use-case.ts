import { GoneException, Injectable, NotFoundException } from '@nestjs/common';
import { NormalizedSurebet } from '../../../surebets-current/application/contracts/normalized-surebet';
import { NormalizedSurebetSnapshot } from '../../../surebets-current/application/contracts/normalized-surebet-snapshot';
import { SnapshotSurebetsCacheRepository } from '../../../surebets-current/infrastructure/cache/snapshot-surebets-cache.repository';
import {
  CreateRegisteredSurebetData,
  RegisteredSurebetsRepository,
} from '../../domain/repositories/registered-surebets.repository';
import { RegisterSurebetInput } from '../contracts/register-surebet-request';
import { RegisteredSurebetResponse } from '../contracts/registered-surebet-response';
import { RegisteredSurebetResponseMapper } from '../mappers/registered-surebet-response.mapper';

/**
 * Registers a single surebet the user selected from a temporary Redis snapshot.
 * Re-reads the snapshot, locates the arb by arbHash, and persists ONLY that arb
 * (+ its legs) to Postgres. NEVER calls BetBurger; never bulk-saves the snapshot.
 */
@Injectable()
export class RegisterSurebetUseCase {
  constructor(
    private readonly snapshotCache: SnapshotSurebetsCacheRepository,
    private readonly repository: RegisteredSurebetsRepository,
  ) {}

  async execute(
    input: RegisterSurebetInput,
  ): Promise<RegisteredSurebetResponse> {
    const snapshot = await this.snapshotCache.getSnapshot(
      input.type,
      input.snapshotId,
    );
    if (!snapshot) {
      throw new GoneException(
        'Essa surebet expirou. Atualize a lista e tente novamente.',
      );
    }

    const surebet = snapshot.surebets.find((s) => s.arbHash === input.arbHash);
    if (!surebet) {
      throw new NotFoundException('Surebet não encontrada nesse snapshot.');
    }

    const record = await this.repository.create(
      this.toCreateData(input.userId, snapshot, surebet),
    );
    return RegisteredSurebetResponseMapper.toResponse(record);
  }

  private toCreateData(
    userId: string,
    snapshot: NormalizedSurebetSnapshot,
    surebet: NormalizedSurebet,
  ): CreateRegisteredSurebetData {
    return {
      userId,
      arbHash: surebet.arbHash,
      externalEventId:
        surebet.externalEventId != null
          ? BigInt(Math.trunc(surebet.externalEventId))
          : 0n,
      type: snapshot.type,
      percent: surebet.percent,
      arbType: surebet.arbType,
      minKoef: surebet.minKoef,
      maxKoef: surebet.maxKoef,
      eventName: surebet.event.name,
      leagueName: surebet.event.leagueName,
      sportId: surebet.event.sportId,
      sportName: surebet.event.sportName,
      team1Name: surebet.event.team1Name,
      team2Name: surebet.event.team2Name,
      currentScoreWhenRegistered: surebet.event.currentScore,
      rawSnapshot: {
        snapshotId: snapshot.snapshotId,
        fetchedAt: snapshot.fetchedAt,
        expiresAt: snapshot.expiresAt,
        arbHash: surebet.arbHash,
        surebet,
      },
      legs: surebet.legs.map((leg) => ({
        legIndex: leg.legIndex,
        externalBetId: leg.externalBetId,
        externalBookmakerId: leg.bookmaker.externalBookmakerId,
        bookmakerName: leg.bookmaker.name,
        bookmakerUrl: leg.bookmaker.url,
        odd: leg.odd ?? 0,
        marketTypeId: leg.market.marketTypeId,
        marketName: leg.market.name,
        marketParam: leg.market.param,
      })),
    };
  }
}
