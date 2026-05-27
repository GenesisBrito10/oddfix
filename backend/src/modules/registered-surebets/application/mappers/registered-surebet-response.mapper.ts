import { RegisteredSurebetRecord } from '../../domain/repositories/registered-surebets.repository';
import { RegisteredSurebetResponse } from '../contracts/registered-surebet-response';

/** Maps the persisted record to the public API response (legs ordered by index). */
export class RegisteredSurebetResponseMapper {
  static toResponse(
    record: RegisteredSurebetRecord,
  ): RegisteredSurebetResponse {
    return {
      id: record.id,
      userId: record.userId,
      arbHash: record.arbHash,
      externalEventId: record.externalEventId.toString(),
      type: record.type,
      percent: record.percent,
      eventName: record.eventName,
      leagueName: record.leagueName,
      sportName: record.sportName,
      status: record.status,
      registeredAt: record.registeredAt.toISOString(),
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
}
