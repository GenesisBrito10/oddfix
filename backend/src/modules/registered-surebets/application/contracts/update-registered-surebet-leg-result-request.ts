import { SurebetLegResultValue } from '../../domain/repositories/registered-surebets.repository';

export interface UpdateRegisteredSurebetLegResultRequest {
  id: string;
  legId: string;
  userId: string;
  result: SurebetLegResultValue;
}
