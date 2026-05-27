import { Injectable } from '@nestjs/common';
import {
  BetburgerProSearchResponse,
  BetburgerRawArb,
  BetburgerRawBet,
} from '../../application/contracts/betburger-pro-search-response';
import {
  NormalizedSurebet,
  NormalizedSurebetEvent,
  NormalizedSurebetLeg,
} from '../../application/contracts/normalized-surebet';
import {
  NormalizedSnapshotMeta,
  NormalizedSurebetSnapshot,
  SurebetType,
} from '../../application/contracts/normalized-surebet-snapshot';
import { MarketNameResolver } from './market-name-resolver.service';
import { fromUnixSeconds } from './unix-time.util';

export interface NormalizationCatalog {
  bookmakersById: Map<number, { name: string; url: string | null }>;
  sportsById: Map<number, string>;
  marketTemplatesById: Map<number, string>;
}

export interface NormalizeInput {
  type: SurebetType;
  rawResponse: BetburgerProSearchResponse;
  fetchedAt: Date;
  currentSnapshotTtlSeconds: number;
  catalog: NormalizationCatalog;
}

/**
 * Pure normalizer: raw pro_search response -> normalized snapshot.
 *
 * Surebets are built from arbs[].bet1_id/bet2_id/bet3_id (NOT by grouping all
 * bets of the same event_id). Each bet*_id points to bets[].id. An arb missing
 * bet1 or bet2 is skipped without breaking the snapshot.
 */
@Injectable()
export class SurebetNormalizer {
  constructor(private readonly marketNameResolver: MarketNameResolver) {}

  normalize(input: NormalizeInput): NormalizedSurebetSnapshot {
    const { type, rawResponse, fetchedAt, currentSnapshotTtlSeconds, catalog } =
      input;

    const bets = rawResponse.bets ?? [];
    const arbs = rawResponse.arbs ?? [];

    const betsById = new Map<string, BetburgerRawBet>();
    for (const bet of bets) {
      betsById.set(String(bet.id), bet);
    }

    const meta: NormalizedSnapshotMeta = {
      rawBets: bets.length,
      rawArbs: arbs.length,
      normalized: 0,
      skipped: 0,
      missingBookmakers: 0,
      missingMarkets: 0,
      missingSports: 0,
    };

    const surebets: NormalizedSurebet[] = [];

    for (const arb of arbs) {
      const bet1 = this.lookupBet(betsById, arb.bet1_id);
      const bet2 = this.lookupBet(betsById, arb.bet2_id);
      const bet3 = this.lookupBet(betsById, arb.bet3_id);

      // bet1 and bet2 are mandatory; bet3 is optional.
      if (!bet1 || !bet2) {
        meta.skipped += 1;
        continue;
      }

      const legBets = [bet1, bet2, bet3].filter((bet): bet is BetburgerRawBet =>
        Boolean(bet),
      );

      const legs = legBets.map((bet, index) =>
        this.buildLeg(bet, index + 1, catalog, meta),
      );

      const event = this.buildEvent(arb, legBets, catalog, meta);
      const percent = this.toNumber(arb.percent);

      surebets.push({
        arbHash: arb.arb_hash,
        externalEventId: this.toNumber(arb.event_id),
        percent,
        openingProfitPct: percent,
        arbType: arb.arb_type ?? null,
        minKoef: this.toNumber(arb.min_koef),
        maxKoef: this.toNumber(arb.max_koef),
        event,
        legs,
      });
      meta.normalized += 1;
    }

    const fetchedMs = fetchedAt.getTime();
    return {
      type,
      snapshotId: `${type.toLowerCase()}-${fetchedMs}`,
      fetchedAt: fetchedAt.toISOString(),
      expiresAt: new Date(
        fetchedMs + currentSnapshotTtlSeconds * 1000,
      ).toISOString(),
      isStale: false,
      total: surebets.length,
      surebets,
      meta,
    };
  }

  private lookupBet(
    betsById: Map<string, BetburgerRawBet>,
    betId: string | number | null | undefined,
  ): BetburgerRawBet | undefined {
    if (betId == null) {
      return undefined;
    }
    return betsById.get(String(betId));
  }

  private buildLeg(
    bet: BetburgerRawBet,
    legIndex: number,
    catalog: NormalizationCatalog,
    meta: NormalizedSnapshotMeta,
  ): NormalizedSurebetLeg {
    const bookmakerId = this.toNumber(bet.bookmaker_id) ?? -1;
    const bookmakerEntry = catalog.bookmakersById.get(bookmakerId);
    if (!bookmakerEntry) {
      meta.missingBookmakers += 1;
    }

    const { market, missing } = this.marketNameResolver.resolve(
      this.toNumber(bet.market_and_bet_type),
      bet.market_and_bet_type_param ?? null,
      catalog.marketTemplatesById,
    );
    if (missing) {
      meta.missingMarkets += 1;
    }

    return {
      legIndex,
      externalBetId: String(bet.id),
      bookmaker: {
        externalBookmakerId: bookmakerId,
        name: bookmakerEntry?.name ?? `Bookmaker #${bookmakerId}`,
        url: bookmakerEntry?.url ?? null,
      },
      odd: this.toNumber(bet.koef),
      market,
      periodIdentifier: this.toNumber(bet.period_identifier),
    };
  }

  private buildEvent(
    arb: BetburgerRawArb,
    legBets: BetburgerRawBet[],
    catalog: NormalizationCatalog,
    meta: NormalizedSnapshotMeta,
  ): NormalizedSurebetEvent {
    const pick = <T>(
      getter: (bet: BetburgerRawBet) => T | null | undefined,
    ) => {
      for (const bet of legBets) {
        const value = getter(bet);
        if (value !== null && value !== undefined && value !== '') {
          return value;
        }
      }
      return null;
    };

    const team1Name = pick((bet) => bet.team1_name ?? bet.home);
    const team2Name = pick((bet) => bet.team2_name ?? bet.away);
    const sportId = this.toNumber(pick((bet) => bet.sport_id));

    let sportName: string;
    if (sportId == null) {
      sportName = 'Sport';
      meta.missingSports += 1;
    } else {
      const resolved = catalog.sportsById.get(sportId);
      if (resolved) {
        sportName = resolved;
      } else {
        sportName = `Sport #${sportId}`;
        meta.missingSports += 1;
      }
    }

    const eventName =
      pick((bet) => bet.event_name) ??
      pick((bet) => bet.bookmaker_event_name) ??
      [team1Name, team2Name].filter(Boolean).join(' - ');
    const startedAt = fromUnixSeconds(
      this.toNumber(pick((bet) => bet.started_at)),
    );

    return {
      name: eventName || '',
      bookmakerEventName: pick((bet) => bet.bookmaker_event_name),
      leagueName: pick((bet) => bet.league_name ?? bet.league),
      bookmakerLeagueName: pick((bet) => bet.bookmaker_league_name),
      sportId,
      sportName,
      team1Name,
      team2Name,
      startedAt: startedAt ? startedAt.toISOString() : null,
      currentScore: pick((bet) => bet.current_score),
      isLive: Boolean(pick((bet) => bet.is_live)),
    };
  }

  private toNumber(value: number | string | null | undefined): number | null {
    if (value == null) {
      return null;
    }
    const parsed = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
}
