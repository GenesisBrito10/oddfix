import { NormalizedSurebet } from '../../application/contracts/normalized-surebet';
import { GetCurrentSurebetsQuery } from '../../application/contracts/get-current-surebets-query';

/** Pure in-memory filtering of a snapshot's surebets. */
export class CurrentSurebetsFilterService {
  apply(
    surebets: NormalizedSurebet[],
    query: GetCurrentSurebetsQuery,
  ): NormalizedSurebet[] {
    let result = surebets;

    if (query.search) {
      const term = query.search.toLowerCase();
      result = result.filter((surebet) =>
        this.haystack(surebet).includes(term),
      );
    }

    if (query.minPercent !== undefined) {
      const min = query.minPercent;
      result = result.filter(
        (surebet) => surebet.percent !== null && surebet.percent >= min,
      );
    }

    if (query.maxPercent !== undefined) {
      const max = query.maxPercent;
      result = result.filter(
        (surebet) => surebet.percent !== null && surebet.percent <= max,
      );
    }

    if (query.bookmakers && query.bookmakers.length > 0) {
      const wanted = query.bookmakers.map((name) => name.toLowerCase());
      result = result.filter((surebet) =>
        surebet.legs.some((leg) =>
          wanted.includes(leg.bookmaker.name.toLowerCase()),
        ),
      );
    }

    if (query.sports && query.sports.length > 0) {
      const wanted = query.sports.map((sport) => sport.toLowerCase());
      result = result.filter((surebet) => {
        const byName = surebet.event.sportName.toLowerCase();
        const byId =
          surebet.event.sportId !== null ? String(surebet.event.sportId) : null;
        return (
          wanted.includes(byName) || (byId !== null && wanted.includes(byId))
        );
      });
    }

    if (query.legs !== undefined) {
      result = result.filter((surebet) => surebet.legs.length === query.legs);
    }

    return result;
  }

  private haystack(surebet: NormalizedSurebet): string {
    return [
      surebet.event.name,
      surebet.event.leagueName,
      surebet.event.team1Name,
      surebet.event.team2Name,
      surebet.event.sportName,
      ...surebet.legs.map((leg) => leg.bookmaker.name),
      ...surebet.legs.map((leg) => leg.market.name),
    ]
      .filter((value): value is string => Boolean(value))
      .join(' ')
      .toLowerCase();
  }
}
