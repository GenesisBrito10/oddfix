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

  return count
}
