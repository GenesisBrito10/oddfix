export type SortBy = 'profit' | 'recent' | 'start'

export interface FilterState {
  investment: string
  sortBy: SortBy
  options: 2 | 3
  profitRange: [number, number]
  selectedBookies: string[]
  selectedSports: string[]
  disabledMarkets: string[]
  // Segundos que um jogo continua na tela após sumir do snapshot do backend.
  gameTtlSeconds: number
  // % mínima por janela de tempo até o início (pré-live). bracketId -> % mínima.
  minPercentByBracket: Record<string, number>
  // Corte de % máxima (ex.: esconder odds absurdas / erradas).
  maxPercentEnabled: boolean
  maxPercent: number
}

// Janelas de tempo até o início do jogo (em minutos), do mais próximo ao mais distante.
export const TIME_BRACKETS = [
  { id: 'h0_3', label: '00-03 horas', max: 180 },
  { id: 'h3_6', label: '03-06 horas', max: 360 },
  { id: 'h6_12', label: '06-12 horas', max: 720 },
  { id: 'h12_18', label: '12-18 horas', max: 1080 },
  { id: 'h18_24', label: '18-24 horas', max: 1440 },
  { id: 'h24_36', label: '24-36 horas', max: 2160 },
  { id: 'h36_48', label: '36-48 horas', max: 2880 },
  { id: 'd2_3', label: '02-03 dias', max: 4320 },
  { id: 'd3_4', label: '03-04 dias', max: 5760 },
  { id: 'd4_5', label: '04-05 dias', max: 7200 },
  { id: 'd5_6', label: '05-06 dias', max: 8640 },
  { id: 'd6_7', label: '06-07 dias', max: 10080 },
] as const

// % mínima exigida para um jogo que começa em `startsInMinutes` (0 = sem restrição).
export const minPercentForStart = (
  map: Record<string, number> | undefined,
  startsInMinutes: number,
): number => {
  if (!map) return 0
  for (const bracket of TIME_BRACKETS) {
    if (startsInMinutes <= bracket.max) return map[bracket.id] ?? 0
  }
  return 0
}

export const defaultFilters = (): FilterState => ({
  investment: '1.000,00',
  sortBy: 'profit',
  options: 2,
  profitRange: [0, 30],
  // Empty = no bookmaker restriction (show all). The user narrows by picking
  // real houses (loaded from the backend catalog) in the sidebar.
  selectedBookies: [],
  // Empty = all sports. Populated from the live data via useAvailableSports().
  selectedSports: [],
  disabledMarkets: [],
  gameTtlSeconds: 30,
  minPercentByBracket: {},
  maxPercentEnabled: false,
  maxPercent: 150,
})

// Sports present in the current snapshot — pages fill this from their surebets so
// the sidebar can offer a sport filter without a dedicated catalog endpoint.
export const useAvailableSports = () => useState<string[]>('available-sports', () => [])

export const usePreLiveFilters = () => useState<FilterState>('pre-live-filters', defaultFilters)
export const useAppliedPreLiveFilters = () => useState<FilterState>('applied-pre-live-filters', defaultFilters)
export const useLiveFilters = () => useState<FilterState>('live-filters', defaultFilters)
export const useAppliedLiveFilters = () => useState<FilterState>('applied-live-filters', defaultFilters)

export const activeFilterCount = (filters: FilterState, isLive: boolean) => {
  const defaults = defaultFilters()
  let count = 0

  if (filters.sortBy !== defaults.sortBy) count++
  if (filters.options !== defaults.options) count++
  if (filters.profitRange[0] !== defaults.profitRange[0] || filters.profitRange[1] !== defaults.profitRange[1]) count++
  if (filters.selectedBookies.length > 0) count++
  if ((filters.selectedSports?.length ?? 0) > 0) count++
  count += filters.disabledMarkets.length
  if ((filters.gameTtlSeconds ?? defaults.gameTtlSeconds) !== defaults.gameTtlSeconds) count++
  if (Object.values(filters.minPercentByBracket ?? {}).some((v) => v > 0)) count++
  if (filters.maxPercentEnabled) count++

  return count
}
