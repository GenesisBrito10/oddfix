export type SurebetResultValue =  'GREEN' | 'RED' | 'VOID' | 'CANCELLED'

export interface HistoryLeg {
  id: string
  legIndex: number
  bookmakerName: string
  bookmakerUrl: string | null
  odd: number
  marketName: string
  result: SurebetResultValue
}

export interface HistoryItem {
  id: string
  arbHash: string
  externalEventId: string
  type: 'LIVE' | 'PREMATCH'
  percent: number | null
  arbType: string | null
  minKoef: number | null
  maxKoef: number | null
  eventName: string
  leagueName: string | null
  sportName: string | null
  team1Name: string | null
  team2Name: string | null
  currentScoreWhenRegistered: string | null
  status: SurebetResultValue
  registeredAt: string
  updatedAt: string
  legs: HistoryLeg[]
}

export interface HistoryPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface HistoryListResponse {
  items: HistoryItem[]
  pagination: HistoryPagination
}

export interface HistoryQuery {
  status?: SurebetResultValue
  type?: 'LIVE' | 'PREMATCH'
  search?: string
  sort?: 'registeredAt_desc' | 'registeredAt_asc' | 'percent_desc' | 'percent_asc'
  page?: number
  limit?: number
}

const statusOf = (error: unknown): number | undefined => {
  const candidate = error as { statusCode?: number; response?: { status?: number } }
  return candidate?.statusCode ?? candidate?.response?.status
}

/**
 * Talks to the authenticated /surebets/history* endpoints with the Bearer token
 * from the `oddfix_token` cookie. On 401 it clears the session and redirects to
 * login. All reads/updates are scoped to the logged-in user by the backend.
 */
export const useSurebetHistory = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase
  const token = useCookie<string | null>('oddfix_token')

  const authHeaders = (): Record<string, string> | undefined =>
    token.value ? { Authorization: `Bearer ${token.value}` } : undefined

  const handle401 = async (error: unknown): Promise<void> => {
    if (statusOf(error) === 401) {
      token.value = null
      await navigateTo('/login')
    }
  }

  const listHistory = async (query: HistoryQuery = {}): Promise<HistoryListResponse> => {
    try {
      return await $fetch<HistoryListResponse>(`${apiBase}/surebets/history`, {
        query,
        headers: authHeaders(),
      })
    } catch (error) {
      await handle401(error)
      throw error
    }
  }

  const getHistoryById = async (id: string): Promise<HistoryItem> => {
    try {
      return await $fetch<HistoryItem>(`${apiBase}/surebets/history/${id}`, {
        headers: authHeaders(),
      })
    } catch (error) {
      await handle401(error)
      throw error
    }
  }

  const updateSurebetStatus = async (
    id: string,
    status: SurebetResultValue,
  ): Promise<HistoryItem> => {
    try {
      return await $fetch<HistoryItem>(`${apiBase}/surebets/history/${id}/status`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: { status },
      })
    } catch (error) {
      await handle401(error)
      throw error
    }
  }

  const updateLegResult = async (
    id: string,
    legId: string,
    result: SurebetResultValue,
  ): Promise<HistoryItem> => {
    try {
      return await $fetch<HistoryItem>(
        `${apiBase}/surebets/history/${id}/legs/${legId}/result`,
        {
          method: 'PATCH',
          headers: authHeaders(),
          body: { result },
        },
      )
    } catch (error) {
      await handle401(error)
      throw error
    }
  }

  return { listHistory, getHistoryById, updateSurebetStatus, updateLegResult }
}
