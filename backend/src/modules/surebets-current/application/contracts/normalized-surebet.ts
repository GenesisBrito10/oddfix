export interface NormalizedBookmaker {
  externalBookmakerId: number;
  name: string;
  url: string | null;
}

export interface NormalizedMarket {
  marketTypeId: number | null;
  name: string;
  param: number | null;
}

export interface NormalizedSurebetLeg {
  legIndex: number;
  externalBetId: string;
  bookmaker: NormalizedBookmaker;
  odd: number | null;
  market: NormalizedMarket;
  periodIdentifier: number | null;
}

export interface NormalizedSurebetEvent {
  name: string;
  bookmakerEventName: string | null;
  leagueName: string | null;
  bookmakerLeagueName: string | null;
  sportId: number | null;
  sportName: string;
  team1Name: string | null;
  team2Name: string | null;
  startedAt: string | null;
  currentScore: string | null;
  isLive: boolean;
}

export interface NormalizedSurebet {
  arbHash: string;
  externalEventId: number | null;
  percent: number | null;
  /**
   * TODO (Fase 6 / Redis): preserve the first percent seen per arbHash to
   * compute real live decay. For now it mirrors `percent`.
   */
  openingProfitPct: number | null;
  arbType: string | null;
  minKoef: number | null;
  maxKoef: number | null;
  event: NormalizedSurebetEvent;
  legs: NormalizedSurebetLeg[];
}
