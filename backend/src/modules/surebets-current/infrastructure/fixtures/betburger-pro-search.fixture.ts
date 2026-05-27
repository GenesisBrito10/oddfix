import { BetburgerProSearchResponse } from '../../application/contracts/betburger-pro-search-response';
import { NormalizationCatalog } from '../../domain/services/surebet-normalizer.service';

/** Small catalog covering the fixture data. */
export function buildFixtureCatalog(): NormalizationCatalog {
  return {
    bookmakersById: new Map<number, { name: string; url: string | null }>([
      [461, { name: 'BetNacional', url: 'https://betnacional.bet.br/' }],
      [127, { name: 'Blaze', url: 'https://blaze.com/' }],
    ]),
    sportsById: new Map<number, string>([
      [1, 'Baseball'],
      [24, 'Table Tennis'],
    ]),
    marketTemplatesById: new Map<number, string>([
      [7, 'European Handicap2(%s)'],
      [17, 'Asian Handicap1(%s)'],
      [18, 'Asian Handicap2(%s)'],
      [1, 'Team1 Win'],
    ]),
  };
}

/** Baseball, 2 legs (bet3 null). */
export const proSearchFixtureTwoLegs: BetburgerProSearchResponse = {
  bets: [
    {
      id: 'MTY0OTQwMDQ3MXw3LDQuMCwtMSwwLDAsMA',
      event_id: 73488520,
      bookmaker_id: 461,
      bookmaker_event_name: 'Arizona Diamondbacks - Colorado Rockies',
      bookmaker_league_name: 'USA. MLB',
      event_name: 'Arizona Diamondbacks - Colorado Rockies',
      league_name: 'USA. MLB',
      sport_id: 1,
      team1_name: 'Arizona Diamondbacks',
      team2_name: 'Colorado Rockies',
      koef: 2.0,
      market_and_bet_type: 7,
      market_and_bet_type_param: '4.0',
      period_identifier: -1,
      current_score: '',
      is_live: true,
      started_at: 1779591000,
    },
    {
      id: 'MTY0OTQwNTM1NnwxNywtMy41LC0xLDAsMCww',
      event_id: 73488520,
      bookmaker_id: 127,
      event_name: 'Arizona Diamondbacks - Colorado Rockies',
      league_name: 'USA. MLB',
      sport_id: 1,
      team1_name: 'Arizona Diamondbacks',
      team2_name: 'Colorado Rockies',
      koef: 2.04,
      market_and_bet_type: 17,
      market_and_bet_type_param: '-3.5',
      period_identifier: -1,
      is_live: true,
    },
  ],
  arbs: [
    {
      arb_hash: '8e453b6c5929c6aee2b01ec96a7b95ee',
      event_id: 73488520,
      bet1_id: 'MTY0OTQwMDQ3MXw3LDQuMCwtMSwwLDAsMA',
      bet2_id: 'MTY0OTQwNTM1NnwxNywtMy41LC0xLDAsMCww',
      bet3_id: null,
      percent: 0.99,
      arb_type: '1:2',
      min_koef: 2.0,
      max_koef: 2.04,
    },
  ],
};

/** Table Tennis, markets 17 + 18, bet3 null. */
export const proSearchFixtureTableTennis: BetburgerProSearchResponse = {
  bets: [
    {
      id: 'tt-bet-1',
      event_id: 91000001,
      bookmaker_id: 461,
      event_name: 'Player A - Player B',
      league_name: 'Setka Cup',
      sport_id: 24,
      team1_name: 'Player A',
      team2_name: 'Player B',
      koef: 1.95,
      market_and_bet_type: 17,
      market_and_bet_type_param: '-1.5',
      is_live: false,
    },
    {
      id: 'tt-bet-2',
      event_id: 91000001,
      bookmaker_id: 127,
      event_name: 'Player A - Player B',
      league_name: 'Setka Cup',
      sport_id: 24,
      koef: 2.1,
      market_and_bet_type: 18,
      market_and_bet_type_param: '1.5',
      is_live: false,
    },
  ],
  arbs: [
    {
      arb_hash: 'tt-arb-1',
      event_id: 91000001,
      bet1_id: 'tt-bet-1',
      bet2_id: 'tt-bet-2',
      bet3_id: null,
      percent: 1.42,
      arb_type: '1:2',
    },
  ],
};
