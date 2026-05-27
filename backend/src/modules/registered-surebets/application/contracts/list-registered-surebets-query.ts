// Canonical types live in the domain repository port; re-exported here so the
// application layer (use case + controller) has a stable contract import.
export type {
  ListRegisteredSurebetsQuery,
  ListRegisteredSurebetsResult,
  RegisteredSurebetSort,
} from '../../domain/repositories/registered-surebets.repository';
