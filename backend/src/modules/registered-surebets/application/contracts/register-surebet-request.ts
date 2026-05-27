import { SurebetType } from '../../../surebets-current/application/contracts/normalized-surebet-snapshot';

/** Input to RegisterSurebetUseCase. userId always comes from the JWT. */
export interface RegisterSurebetInput {
  userId: string;
  type: SurebetType;
  snapshotId: string;
  arbHash: string;
}
