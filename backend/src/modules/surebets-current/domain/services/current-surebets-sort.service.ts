import { NormalizedSurebet } from '../../application/contracts/normalized-surebet';
import { CurrentSurebetsSort } from '../../application/contracts/get-current-surebets-query';

/** Pure in-memory sorting. Returns a new array; never mutates the input. */
export class CurrentSurebetsSortService {
  apply(
    surebets: NormalizedSurebet[],
    sort: CurrentSurebetsSort | undefined,
  ): NormalizedSurebet[] {
    const items = [...surebets];

    switch (sort) {
      case 'profit':
        return items.sort(
          (a, b) => (b.percent ?? -Infinity) - (a.percent ?? -Infinity),
        );
      case 'start':
        return items.sort(
          (a, b) =>
            this.startTime(a.event.startedAt) -
            this.startTime(b.event.startedAt),
        );
      case 'recent':
        // No per-surebet scan timestamp; newest-first heuristic = reverse the
        // snapshot order (BetBurger returns most-relevant first).
        return items.reverse();
      default:
        return items;
    }
  }

  /** null startedAt sorts last (treated as +Infinity). */
  private startTime(startedAt: string | null): number {
    if (!startedAt) {
      return Number.POSITIVE_INFINITY;
    }
    const time = Date.parse(startedAt);
    return Number.isNaN(time) ? Number.POSITIVE_INFINITY : time;
  }
}
