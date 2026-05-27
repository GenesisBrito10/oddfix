import { BetburgerProSearchResponse } from '../../../application/contracts/betburger-pro-search-response';
import {
  buildFixtureCatalog,
  proSearchFixtureTwoLegs,
} from '../../../infrastructure/fixtures/betburger-pro-search.fixture';
import { MarketNameResolver } from '../market-name-resolver.service';
import {
  NormalizationCatalog,
  SurebetNormalizer,
} from '../surebet-normalizer.service';

const FETCHED_AT = new Date('2026-05-24T03:31:50.840Z');

function normalize(
  response: BetburgerProSearchResponse,
  catalog: NormalizationCatalog = buildFixtureCatalog(),
  ttl = 10,
) {
  const normalizer = new SurebetNormalizer(new MarketNameResolver());
  return normalizer.normalize({
    type: 'LIVE',
    rawResponse: response,
    fetchedAt: FETCHED_AT,
    currentSnapshotTtlSeconds: ttl,
    catalog,
  });
}

describe('SurebetNormalizer', () => {
  it('normalizes a 2-leg surebet (bet3 null) resolving market/bookmaker/sport', () => {
    const snapshot = normalize(proSearchFixtureTwoLegs);

    expect(snapshot.total).toBe(1);
    const surebet = snapshot.surebets[0];
    expect(surebet.arbHash).toBe('8e453b6c5929c6aee2b01ec96a7b95ee');
    expect(surebet.externalEventId).toBe(73488520);
    expect(surebet.percent).toBe(0.99);
    expect(surebet.openingProfitPct).toBe(0.99);
    expect(surebet.legs).toHaveLength(2);

    expect(surebet.legs[0].market.name).toBe('European Handicap2(4.0)');
    expect(surebet.legs[1].market.name).toBe('Asian Handicap1(-3.5)');

    expect(surebet.legs[0].bookmaker.name).toBe('BetNacional');
    expect(surebet.legs[0].bookmaker.url).toBe('https://betnacional.bet.br/');
    expect(surebet.legs[1].bookmaker.name).toBe('Blaze');

    expect(surebet.event.sportName).toBe('Baseball');
    expect(surebet.event.isLive).toBe(true);
    expect(surebet.event.startedAt).toBe('2026-05-24T02:50:00.000Z');
    expect(surebet.legs[0].legIndex).toBe(1);
    expect(surebet.legs[1].legIndex).toBe(2);
  });

  it('normalizes a 3-leg surebet', () => {
    const response: BetburgerProSearchResponse = {
      bets: [
        {
          id: 'a',
          sport_id: 1,
          bookmaker_id: 461,
          koef: 2,
          market_and_bet_type: 1,
        },
        {
          id: 'b',
          sport_id: 1,
          bookmaker_id: 127,
          koef: 3,
          market_and_bet_type: 1,
        },
        {
          id: 'c',
          sport_id: 1,
          bookmaker_id: 461,
          koef: 4,
          market_and_bet_type: 1,
        },
      ],
      arbs: [
        {
          arb_hash: 'h3',
          event_id: 1,
          bet1_id: 'a',
          bet2_id: 'b',
          bet3_id: 'c',
          percent: 5,
        },
      ],
    };

    const snapshot = normalize(response);
    expect(snapshot.surebets[0].legs).toHaveLength(3);
    expect(snapshot.surebets[0].legs.map((leg) => leg.externalBetId)).toEqual([
      'a',
      'b',
      'c',
    ]);
  });

  it('builds legs only from the arb bets, not all bets sharing event_id', () => {
    const response: BetburgerProSearchResponse = {
      bets: [
        {
          id: 'a',
          event_id: 50,
          sport_id: 1,
          bookmaker_id: 461,
          koef: 2,
          market_and_bet_type: 1,
        },
        {
          id: 'b',
          event_id: 50,
          sport_id: 1,
          bookmaker_id: 127,
          koef: 2,
          market_and_bet_type: 1,
        },
        {
          id: 'c',
          event_id: 50,
          sport_id: 1,
          bookmaker_id: 461,
          koef: 2,
          market_and_bet_type: 1,
        },
        {
          id: 'd',
          event_id: 50,
          sport_id: 1,
          bookmaker_id: 127,
          koef: 2,
          market_and_bet_type: 1,
        },
      ],
      arbs: [
        { arb_hash: 'h', event_id: 50, bet1_id: 'a', bet2_id: 'b', percent: 3 },
      ],
    };

    const snapshot = normalize(response);
    expect(snapshot.surebets).toHaveLength(1);
    expect(snapshot.surebets[0].legs).toHaveLength(2);
    expect(snapshot.surebets[0].legs.map((leg) => leg.externalBetId)).toEqual([
      'a',
      'b',
    ]);
  });

  it('keeps the template verbatim when it has no %s', () => {
    const response: BetburgerProSearchResponse = {
      bets: [
        {
          id: 'a',
          sport_id: 1,
          bookmaker_id: 461,
          koef: 2,
          market_and_bet_type: 1,
        },
        {
          id: 'b',
          sport_id: 1,
          bookmaker_id: 127,
          koef: 2,
          market_and_bet_type: 1,
        },
      ],
      arbs: [{ arb_hash: 'h', bet1_id: 'a', bet2_id: 'b' }],
    };
    const snapshot = normalize(response);
    expect(snapshot.surebets[0].legs[0].market.name).toBe('Team1 Win');
  });

  it('falls back for unknown market and counts missingMarkets', () => {
    const response: BetburgerProSearchResponse = {
      bets: [
        {
          id: 'a',
          sport_id: 1,
          bookmaker_id: 461,
          koef: 2,
          market_and_bet_type: 999,
          market_and_bet_type_param: '2.5',
        },
        {
          id: 'b',
          sport_id: 1,
          bookmaker_id: 127,
          koef: 2,
          market_and_bet_type: 1,
        },
      ],
      arbs: [{ arb_hash: 'h', bet1_id: 'a', bet2_id: 'b' }],
    };
    const snapshot = normalize(response);
    expect(snapshot.surebets[0].legs[0].market.name).toBe('Market #999');
    expect(snapshot.meta.missingMarkets).toBe(1);
  });

  it('falls back for unknown bookmaker and counts missingBookmakers', () => {
    const response: BetburgerProSearchResponse = {
      bets: [
        {
          id: 'a',
          sport_id: 1,
          bookmaker_id: 999,
          koef: 2,
          market_and_bet_type: 1,
        },
        {
          id: 'b',
          sport_id: 1,
          bookmaker_id: 461,
          koef: 2,
          market_and_bet_type: 1,
        },
      ],
      arbs: [{ arb_hash: 'h', bet1_id: 'a', bet2_id: 'b' }],
    };
    const snapshot = normalize(response);
    expect(snapshot.surebets[0].legs[0].bookmaker.name).toBe('Bookmaker #999');
    expect(snapshot.surebets[0].legs[0].bookmaker.url).toBeNull();
    expect(snapshot.meta.missingBookmakers).toBe(1);
  });

  it('falls back for unknown sport without breaking', () => {
    const response: BetburgerProSearchResponse = {
      bets: [
        {
          id: 'a',
          sport_id: 999,
          bookmaker_id: 461,
          koef: 2,
          market_and_bet_type: 1,
        },
        {
          id: 'b',
          sport_id: 999,
          bookmaker_id: 127,
          koef: 2,
          market_and_bet_type: 1,
        },
      ],
      arbs: [{ arb_hash: 'h', bet1_id: 'a', bet2_id: 'b' }],
    };
    const snapshot = normalize(response);
    expect(snapshot.surebets[0].event.sportName).toBe('Sport #999');
    expect(snapshot.meta.missingSports).toBe(1);
  });

  it('skips an incomplete arb without breaking the snapshot', () => {
    const response: BetburgerProSearchResponse = {
      bets: [
        {
          id: 'b',
          sport_id: 1,
          bookmaker_id: 461,
          koef: 2,
          market_and_bet_type: 1,
        },
      ],
      arbs: [{ arb_hash: 'h', bet1_id: 'missing', bet2_id: 'b' }],
    };
    const snapshot = normalize(response);
    expect(snapshot.total).toBe(0);
    expect(snapshot.meta.skipped).toBe(1);
    expect(snapshot.surebets).toEqual([]);
  });

  it('produces the right snapshotId, expiresAt and total', () => {
    const snapshot = normalize(
      proSearchFixtureTwoLegs,
      buildFixtureCatalog(),
      10,
    );
    expect(snapshot.type).toBe('LIVE');
    expect(snapshot.snapshotId).toBe(`live-${FETCHED_AT.getTime()}`);
    expect(snapshot.fetchedAt).toBe('2026-05-24T03:31:50.840Z');
    expect(snapshot.expiresAt).toBe('2026-05-24T03:32:00.840Z');
    expect(snapshot.total).toBe(snapshot.surebets.length);
    expect(snapshot.meta.rawBets).toBe(2);
    expect(snapshot.meta.rawArbs).toBe(1);
    expect(snapshot.meta.normalized).toBe(1);
  });
});
