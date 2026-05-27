import { RegisteredSurebetStatusValue } from '../../domain/repositories/registered-surebets.repository';

export interface UpdateRegisteredSurebetStatusRequest {
  id: string;
  userId: string;
  status: RegisteredSurebetStatusValue;
}
