export interface BetLeg {
  bookmaker: string
  market: string
  odds: number
  stake: number
  instrucoes: string
  // Additive (from the real API; optional so mocks keep working):
  bookmakerUrl?: string
  externalBetId?: string
}

export interface Surebet {
  id: string
  game: string
  league: string
  time: string
  profitPct: number
  openingProfitPct?: number
  investment: number
  returns: number
  // Widened to string: BetBurger has many sports (Baseball, Table Tennis, ...).
  sport: string
  isNew?: boolean
  startsInMinutes: number
  legs: BetLeg[]
  // Additive (from the real API):
  snapshotId?: string
  arbHash?: string
  type?: 'LIVE' | 'PREMATCH'
}

export const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const mockSurebets: Surebet[] = [
  {
    id: '1',
    game: 'Djokovic vs. Alcaraz',
    league: 'ATP Paris Masters',
    time: 'Começando em 15min',
    profitPct: 12.45,
    investment: 1000,
    returns: 1124.5,
    sport: 'tennis',
    isNew: true,
    startsInMinutes: 15,
    legs: [
      { bookmaker: 'Betpix365', market: 'Djokovic Vence (ML)', odds: 2.25, stake: 500, instrucoes: 'Esportes › Tênis › ATP Paris Masters › Vencedor › Djokovic' },
      { bookmaker: 'Galerabet', market: 'Alcaraz Vence (ML)', odds: 2.25, stake: 500, instrucoes: 'Esportes › Tênis › ATP Paris Masters › Vencedor › Alcaraz' },
    ],
  },
  {
    id: '2',
    game: 'Real Madrid vs. Bayern Munich',
    league: 'Champions League',
    time: 'Hoje às 13:00',
    profitPct: 3.28,
    investment: 1000,
    returns: 1032.8,
    sport: 'football',
    startsInMinutes: 180,
    legs: [
      { bookmaker: 'Betnacional', market: 'Real Madrid Vence', odds: 2.1, stake: 476.19, instrucoes: 'Esportes › Futebol › Champions League › Resultado Final › Real Madrid' },
      { bookmaker: 'Esportes da Sorte', market: 'Bayern Vence ou Empate', odds: 1.91, stake: 523.81, instrucoes: 'Esportes › Futebol › Champions League › Resultado Final › Bayern ou Empate' },
    ],
  },
  {
    id: '3',
    game: 'Flamengo vs. Palmeiras',
    league: 'Brasileirão Série A',
    time: 'Hoje às 20:30',
    profitPct: 7.62,
    investment: 1000,
    returns: 1076.2,
    sport: 'football',
    isNew: true,
    startsInMinutes: 510,
    legs: [
      { bookmaker: 'Pixbet', market: 'Flamengo Vence', odds: 2.35, stake: 425.53, instrucoes: 'Esportes › Futebol › Brasileirão › Resultado Final › Flamengo' },
      { bookmaker: 'OnaBet', market: 'Empate ou Palmeiras', odds: 1.78, stake: 574.47, instrucoes: 'Esportes › Futebol › Brasileirão › Resultado Final › Empate ou Palmeiras' },
    ],
  },
  {
    id: '4',
    game: 'Lakers vs. Warriors',
    league: 'NBA',
    time: 'Hoje às 22:00',
    profitPct: 8.86,
    investment: 1000,
    returns: 1088.6,
    sport: 'basketball',
    isNew: true,
    startsInMinutes: 1320,
    legs: [
      { bookmaker: 'Betnacional', market: 'Lakers Vence (ML)', odds: 1.95, stake: 558.26, instrucoes: 'Esportes › Basquete › NBA › Vencedor › Lakers' },
      { bookmaker: 'Pixbet', market: 'Warriors Vence (ML)', odds: 2.15, stake: 441.74, instrucoes: 'Esportes › Basquete › NBA › Vencedor › Warriors' },
    ],
  },
  {
    id: '5',
    game: 'Manchester City vs. Liverpool',
    league: 'Premier League',
    time: 'Amanhã às 09:30',
    profitPct: 5.12,
    investment: 1000,
    returns: 1051.2,
    sport: 'football',
    startsInMinutes: 2010,
    legs: [
      { bookmaker: 'Esportes da Sorte', market: 'Over 2.5 Gols', odds: 2.08, stake: 505.38, instrucoes: 'Esportes › Futebol › Premier League › Total de Gols › Acima de 2.5' },
      { bookmaker: 'REALS', market: 'Under 2.5 Gols', odds: 2.12, stake: 494.62, instrucoes: 'Esportes › Futebol › Premier League › Total de Gols › Abaixo de 2.5' },
    ],
  },
  {
    id: '6',
    game: 'Warriors vs. Celtics',
    league: 'NBA Playoffs',
    time: 'Começando em 45min',
    profitPct: 4.91,
    investment: 1500,
    returns: 1573.65,
    sport: 'basketball',
    isNew: true,
    startsInMinutes: 45,
    legs: [
      { bookmaker: 'Esportes da Sorte', market: 'Warriors Vence (H -3.5)', odds: 2.05, stake: 500, instrucoes: 'Esportes › Basquete › NBA Playoffs › Handicap › Warriors -3.5' },
      { bookmaker: 'Novibet', market: 'Celtics Vence (H +3.5)', odds: 2.05, stake: 500, instrucoes: 'Esportes › Basquete › NBA Playoffs › Handicap › Celtics +3.5' },
      { bookmaker: 'REALS', market: 'Total Over 225.5 Pts', odds: 3.2, stake: 500, instrucoes: 'Esportes › Basquete › NBA Playoffs › Total › Acima de 225.5' },
    ],
  },
  {
    id: '7',
    game: 'Bayern Munich vs. PSG',
    league: 'Champions League',
    time: 'Hoje às 16:00',
    profitPct: 11.2,
    investment: 1500,
    returns: 1668,
    sport: 'football',
    isNew: true,
    startsInMinutes: 240,
    legs: [
      { bookmaker: 'Betpix365', market: 'Bayern Vence', odds: 2.15, stake: 500, instrucoes: 'Esportes › Futebol › Champions League › Resultado Final › Bayern' },
      { bookmaker: 'Galerabet', market: 'PSG Vence', odds: 2.35, stake: 500, instrucoes: 'Esportes › Futebol › Champions League › Resultado Final › PSG' },
      { bookmaker: 'OnaBet', market: 'Empate', odds: 3.3, stake: 500, instrucoes: 'Esportes › Futebol › Champions League › Resultado Final › Empate' },
    ],
  },
  {
    id: '8',
    game: 'Brasil vs. Argentina',
    league: 'Eliminatórias Copa do Mundo',
    time: 'Hoje às 21:45',
    profitPct: 9.33,
    investment: 1500,
    returns: 1639.95,
    sport: 'football',
    startsInMinutes: 585,
    legs: [
      { bookmaker: 'Betnacional', market: 'Brasil Vence', odds: 2.4, stake: 500, instrucoes: 'Esportes › Futebol › Eliminatórias › Resultado Final › Brasil' },
      { bookmaker: 'Pixbet', market: 'Empate', odds: 3.6, stake: 333.33, instrucoes: 'Esportes › Futebol › Eliminatórias › Resultado Final › Empate' },
      { bookmaker: 'Betão', market: 'Argentina Vence', odds: 2.95, stake: 666.67, instrucoes: 'Esportes › Futebol › Eliminatórias › Resultado Final › Argentina' },
    ],
  },
]

export const liveSurebets: Surebet[] = [
  {
    id: 'l1',
    game: 'Corinthians vs. Santos',
    league: 'Brasileirão Série A',
    time: "AO VIVO - 67'",
    profitPct: 14.2,
    openingProfitPct: 19.5,
    investment: 1000,
    returns: 1142,
    sport: 'football',
    isNew: true,
    startsInMinutes: 0,
    legs: [
      { bookmaker: 'Betnacional', market: 'Próximo Gol - Corinthians', odds: 2.85, stake: 350.88, instrucoes: 'Esportes › Futebol › Brasileirão › Próximo Gol › Corinthians' },
      { bookmaker: 'Esportes da Sorte', market: 'Próx. Gol - Santos ou Nenhum', odds: 1.72, stake: 649.12, instrucoes: 'Esportes › Futebol › Brasileirão › Próximo Gol › Santos ou Nenhum' },
    ],
  },
  {
    id: 'l2',
    game: 'Serena Williams vs. Iga Swiatek',
    league: 'WTA Finals',
    time: 'AO VIVO - Set 2',
    profitPct: 11.38,
    openingProfitPct: 14,
    investment: 1000,
    returns: 1113.8,
    sport: 'tennis',
    startsInMinutes: 0,
    legs: [
      { bookmaker: 'Pixbet', market: 'Williams Vence Set 2', odds: 2.55, stake: 392.16, instrucoes: 'Esportes › Tênis › WTA Finals › Set 2 › Williams' },
      { bookmaker: 'REALS', market: 'Swiatek Vence Set 2', odds: 1.92, stake: 607.84, instrucoes: 'Esportes › Tênis › WTA Finals › Set 2 › Swiatek' },
    ],
  },
  {
    id: 'l3',
    game: 'Miami Heat vs. New York Knicks',
    league: 'NBA',
    time: 'AO VIVO - Q3 8:32',
    profitPct: 8.05,
    openingProfitPct: 10.2,
    investment: 1000,
    returns: 1080.5,
    sport: 'basketball',
    isNew: true,
    startsInMinutes: 0,
    legs: [
      { bookmaker: 'Galerabet', market: 'Heat Vence Q4', odds: 2.1, stake: 476.19, instrucoes: 'Esportes › Basquete › NBA › Q4 › Miami Heat' },
      { bookmaker: 'Betnacional', market: 'Knicks Vence Q4', odds: 2.1, stake: 523.81, instrucoes: 'Esportes › Basquete › NBA › Q4 › New York Knicks' },
    ],
  },
  {
    id: 'l4',
    game: 'Golden State vs. Boston Celtics',
    league: 'NBA Playoffs',
    time: 'AO VIVO - Q2 4:18',
    profitPct: 12.55,
    openingProfitPct: 16,
    investment: 1500,
    returns: 1688.25,
    sport: 'basketball',
    isNew: true,
    startsInMinutes: 0,
    legs: [
      { bookmaker: 'Esportes da Sorte', market: 'Warriors Vence Q2', odds: 2.05, stake: 500, instrucoes: 'Esportes › Basquete › NBA Playoffs › Q2 › Warriors' },
      { bookmaker: 'Betnacional', market: 'Celtics Vence Q2', odds: 2.18, stake: 500, instrucoes: 'Esportes › Basquete › NBA Playoffs › Q2 › Celtics' },
      { bookmaker: 'Galerabet', market: 'Total Over 55.5 Pts Q2', odds: 3.1, stake: 500, instrucoes: 'Esportes › Basquete › NBA Playoffs › Total Q2 › Acima de 55.5' },
    ],
  },
]
