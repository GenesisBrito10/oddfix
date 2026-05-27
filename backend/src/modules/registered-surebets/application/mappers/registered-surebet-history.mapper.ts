import {
  ListRegisteredSurebetsResult,
  RegisteredSurebetRecord,
} from '../../domain/repositories/registered-surebets.repository';
import {
  RegisteredSurebetHistoryItem,
  RegisteredSurebetHistoryListResponse,
} from '../contracts/registered-surebet-history-response';

/** Maps persisted records to the history API shapes (dates ISO, bigint string). */
export class RegisteredSurebetHistoryMapper {
  static toItem(record: RegisteredSurebetRecord): RegisteredSurebetHistoryItem {
    return {
      id: record.id,
      arbHash: record.arbHash,
      externalEventId: record.externalEventId.toString(),
      type: record.type,
      percent: record.percent,
      arbType: record.arbType,
      minKoef: record.minKoef,
      maxKoef: record.maxKoef,
      eventName: record.eventName,
      leagueName: record.leagueName,
      sportName: record.sportName,
      team1Name: record.team1Name,
      team2Name: record.team2Name,
      currentScoreWhenRegistered: record.currentScoreWhenRegistered,
      status: record.status,
      registeredAt: record.registeredAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
      legs: [...record.legs]
        .sort((a, b) => a.legIndex - b.legIndex)
        .map((leg) => ({
          id: leg.id,
          legIndex: leg.legIndex,
          bookmakerName: leg.bookmakerName,
          bookmakerUrl: leg.bookmakerUrl,
          odd: leg.odd,
          marketName: leg.marketName,
          result: leg.result,
        })),
    };
  }

  static toListResponse(
    result: ListRegisteredSurebetsResult,
    page: number,
    limit: number,
  ): RegisteredSurebetHistoryListResponse {
    return {
      items: result.items.map((record) => this.toItem(record)),
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: limit > 0 ? Math.ceil(result.total / limit) : 0,
      },
    };
  }
}
