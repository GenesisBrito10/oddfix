import { fetchEventSource } from '@microsoft/fetch-event-source'
import type { BetLeg, Surebet } from '~/data/surebets'
import { liveSurebets, mockSurebets } from '~/data/surebets'

type ApiType = 'live' | 'prematch'

interface ApiLeg {
  legIndex: number
  externalBetId: string
  bookmaker: { externalBookmakerId: number; name: string; url: string | null }
  odd: number | null
  market: { marketTypeId: number | null; name: string; param: number | null }
  periodIdentifier: number | null
}

interface ApiSurebet {
  arbHash: string
  externalEventId: number | null
  percent: number | null
  openingProfitPct: number | null
  arbType: string | null
  minKoef: number | null
  maxKoef: number | null
  event: {
    name: string
    bookmakerEventName: string | null
    leagueName: string | null
    bookmakerLeagueName: string | null
    sportId: number | null
    sportName: string
    team1Name: string | null
    team2Name: string | null
    startedAt: string | null
    currentScore: string | null
    isLive: boolean
  }
  legs: ApiLeg[]
}

interface ApiResponse {
  type: 'LIVE' | 'PREMATCH'
  snapshotId: string | null
  fetchedAt: string | null
  expiresAt: string | null
  isStale: boolean
  total: number
  filteredTotal: number
  page: number
  limit: number
  surebets: ApiSurebet[]
}

const formatStart = (startedAt: string | null): string => {
  if (!startedAt) return ''
  const date = new Date(startedAt)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const minutesUntil = (startedAt: string | null): number => {
  if (!startedAt) return Number.MAX_SAFE_INTEGER
  const time = new Date(startedAt).getTime()
  if (Number.isNaN(time)) return Number.MAX_SAFE_INTEGER
  return Math.round((time - Date.now()) / 60000)
}

const mapLeg = (leg: ApiLeg, sportName: string, leagueName: string | null): BetLeg => ({
  bookmaker: leg.bookmaker.name,
  market: leg.market.name,
  odds: leg.odd ?? 0,
  stake: 0,
  instrucoes: [sportName, leagueName, leg.market.name].filter(Boolean).join(' › '),
  bookmakerUrl: leg.bookmaker.url ?? undefined,
  externalBetId: leg.externalBetId,
})

const mapSurebet = (api: ApiSurebet, snapshotId: string | null, type: ApiType): Surebet => {
  const profitPct = api.percent ?? 0
  const investment = 1000
  const game =
    api.event.team1Name && api.event.team2Name
      ? `${api.event.team1Name} vs. ${api.event.team2Name}`
      : api.event.name
  const time = api.event.isLive
    ? `AO VIVO${api.event.currentScore ? ` ${api.event.currentScore}` : ''}`
    : formatStart(api.event.startedAt)

  return {
    id: api.arbHash,
    game,
    league: api.event.leagueName ?? '',
    time,
    profitPct,
    openingProfitPct: api.openingProfitPct ?? undefined,
    investment,
    returns: investment * (1 + profitPct / 100),
    sport: api.event.sportName,
    startsInMinutes: api.event.isLive ? 0 : minutesUntil(api.event.startedAt),
    snapshotId: snapshotId ?? undefined,
    arbHash: api.arbHash,
    type: type === 'live' ? 'LIVE' : 'PREMATCH',
    legs: api.legs.map((leg) => mapLeg(leg, api.event.sportName, api.event.leagueName)),
  }
}

/**
 * Reads the current snapshot from the backend and maps it to the existing
 * Surebet type so cards/modals/filters keep working. Falls back to mock data
 * on error or empty snapshot (dev) so the UI never breaks while real frontend
 * auth is not wired yet.
 */
export const useSurebetsApi = (type: ApiType) => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase
  const token = useCookie<string | null>('oddfix_token')
  const fallback = type === 'live' ? liveSurebets : mockSurebets
  const refreshMs = Number(
    type === 'live'
      ? (config.public.liveRefreshMs ?? 5000)
      : (config.public.prematchRefreshMs ?? 15000),
  )

  const { data, pending, error, refresh } = useAsyncData<Surebet[]>(
    `surebets-${type}`,
    async () => {
      // Not logged in: dev-only mock so the layout can be previewed.
      if (!token.value) {
        return import.meta.dev ? fallback : []
      }
      // Logged in: always show the REAL backend state (empty stays empty —
      // never mask real data with mock).
      try {
        const res = await $fetch<ApiResponse>(`${apiBase}/surebets/current`, {
          query: { type },
          headers: { Authorization: `Bearer ${token.value}` },
        })
        return (res?.surebets ?? []).map((surebet) =>
          mapSurebet(surebet, res.snapshotId, type),
        )
      } catch {
        return []
      }
    },
    { default: () => (import.meta.dev && !token.value ? fallback : []) },
  )

  // Real-time: SSE pushes each snapshot the instant the backend produces it
  // (identical timing). Polling is only a fallback when SSE is off/unavailable.
  if (import.meta.client) {
    const streamEnabled = String(config.public.streamEnabled ?? 'true') === 'true'
    let pollTimer: ReturnType<typeof setInterval> | undefined
    let controller: AbortController | undefined

    const startPolling = () => {
      if (!pollTimer && refreshMs > 0) {
        pollTimer = setInterval(() => void refresh(), refreshMs)
      }
    }
    const stopPolling = () => {
      if (pollTimer) {
        clearInterval(pollTimer)
        pollTimer = undefined
      }
    }

    const applyPayload = (raw: string) => {
      try {
        const payload = JSON.parse(raw) as ApiResponse
        data.value = (payload.surebets ?? []).map((surebet) =>
          mapSurebet(surebet, payload.snapshotId, type),
        )
      } catch {
        // ignore malformed event; next event/poll corrects it
      }
    }

    const startStream = () => {
      // No token → not logged in: keep the (dev mock / empty) fallback via poll.
      if (!token.value) {
        startPolling()
        return
      }
      controller = new AbortController()
      void fetchEventSource(`${apiBase}/surebets/stream?type=${type}`, {
        headers: { Authorization: `Bearer ${token.value}` },
        signal: controller.signal,
        openWhenHidden: true,
        onopen: async (res) => {
          // Stream healthy → stop the fallback poll.
          if (res.ok) stopPolling()
          else startPolling()
        },
        onmessage: (ev) => applyPayload(ev.data),
        // Don't throw: let the lib auto-reconnect; poll covers the gap meanwhile.
        onerror: () => {
          startPolling()
        },
      }).catch(() => startPolling())
    }

    onMounted(() => {
      if (streamEnabled) startStream()
      else startPolling()
    })
    onScopeDispose(() => {
      controller?.abort()
      stopPolling()
    })
  }

  return { surebets: data, pending, error, refresh }
}
