import {
  RegisteredSurebetStatusValue,
  SurebetLegResultValue,
} from '../../domain/repositories/registered-surebets.repository';
import { SurebetType } from '../../../surebets-current/application/contracts/normalized-surebet-snapshot';

export interface RegisteredSurebetLegResponse {
  id: string;
  legIndex: number;
  bookmakerName: string;
  bookmakerUrl: string | null;
  odd: number;
  marketName: string;
  result: SurebetLegResultValue;
}

/**
 * Public shape returned by POST /surebets/register. externalEventId is a string
 * (BigInt is not JSON-serializable); registeredAt is an ISO string.
 */
export interface RegisteredSurebetResponse {
  id: string;
  userId: string;
  arbHash: string;
  externalEventId: string;
  type: SurebetType;
  percent: number | null;
  eventName: string;
  leagueName: string | null;
  sportName: string | null;
  status: RegisteredSurebetStatusValue;
  registeredAt: string;
  legs: RegisteredSurebetLegResponse[];
}
