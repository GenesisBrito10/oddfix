export interface RegisterSurebetInput {
  type: 'LIVE' | 'PREMATCH'
  snapshotId: string
  arbHash: string
}

export interface RegisteredSurebetLeg {
  id: string
  legIndex: number
  bookmakerName: string
  bookmakerUrl: string | null
  odd: number
  marketName: string
  result: string
}

export interface RegisteredSurebet {
  id: string
  userId: string
  arbHash: string
  externalEventId: string
  type: 'LIVE' | 'PREMATCH'
  percent: number | null
  eventName: string
  leagueName: string | null
  sportName: string | null
  status: string
  registeredAt: string
  legs: RegisteredSurebetLeg[]
}

const statusOf = (error: unknown): number | undefined => {
  const candidate = error as { statusCode?: number; response?: { status?: number } }
  return candidate?.statusCode ?? candidate?.response?.status
}

const messageOf = (error: unknown): string | undefined => {
  const data = (error as { data?: { message?: string } })?.data
  return typeof data?.message === 'string' ? data.message : undefined
}

/**
 * POST /surebets/register with the Bearer token from the `oddfix_token` cookie.
 * Re-reads the temporary Redis snapshot on the backend by snapshotId + arbHash.
 * Exposes loading/error/success so the modal can show friendly feedback.
 */
export const useRegisterSurebet = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase
  const token = useCookie<string | null>('oddfix_token')

  const loading = ref(false)
  const error = ref('')
  const success = ref(false)

  const reset = (): void => {
    error.value = ''
    success.value = false
  }

  const register = async (
    input: RegisterSurebetInput,
  ): Promise<RegisteredSurebet | null> => {
    reset()
    loading.value = true
    try {
      const result = await $fetch<RegisteredSurebet>(`${apiBase}/surebets/register`, {
        method: 'POST',
        headers: token.value ? { Authorization: `Bearer ${token.value}` } : undefined,
        body: input,
      })
      success.value = true
      return result
    } catch (err) {
      const status = statusOf(err)
      if (status === 401) {
        error.value = 'Faça login novamente.'
        await navigateTo('/login')
      } else if (status === 410 || status === 404) {
        error.value =
          messageOf(err) ?? 'Essa surebet expirou. Atualize a lista e tente novamente.'
      } else {
        error.value = 'Não foi possível registrar agora. Tente novamente.'
      }
      return null
    } finally {
      loading.value = false
    }
  }

  return { register, reset, loading, error, success }
}
