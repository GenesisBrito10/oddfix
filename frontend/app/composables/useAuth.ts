export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'USER' | 'ADMIN'
  createdAt: string
}

interface AuthResponse {
  accessToken: string
  user: AuthUser
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
  referralCode?: string
}

const statusOf = (error: unknown): number | undefined => {
  const candidate = error as {
    statusCode?: number
    response?: { status?: number }
  }
  return candidate?.statusCode ?? candidate?.response?.status
}

/**
 * Real backend auth. Token lives in the `oddfix_token` cookie (also read by
 * useSurebetsApi for the Bearer header); the public user lives in shared state.
 * Same surface (user / isLoggedIn / login / logout) as the old fake auth, plus
 * register / fetchMe / accessToken.
 */
export const useAuth = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase

  // NOTE: not httpOnly — the SPA must read it to send the Bearer header.
  // Hardening to an httpOnly cookie + server-side proxy is tracked in docs/security.md.
  // secure in production (HTTPS); maxAge ~ JWT_EXPIRES_IN default (7d).
  const token = useCookie<string | null>('oddfix_token', {
    sameSite: 'lax',
    // Secure ONLY over real HTTPS. The desktop app serves the embedded server over
    // http://127.0.0.1 — a Secure cookie there is silently dropped (login looks fine
    // but no token is stored, so authed calls return nothing).
    secure: import.meta.client ? window.location.protocol === 'https:' : false,
    maxAge: 60 * 60 * 24 * 7,
    default: () => null,
  })
  const user = useState<AuthUser | null>('auth_user', () => null)
  // token covers refresh/SSR (cookie sent with the request); user covers the
  // moment right after login(), where useCookie's write hasn't flushed yet —
  // user is useState (shared + synchronous) so the middleware sees it at once.
  const isLoggedIn = computed(() => Boolean(token.value || user.value))

  const applySession = (response: AuthResponse): AuthUser => {
    token.value = response.accessToken
    user.value = response.user
    return response.user
  }

  const login = async (payload: LoginPayload): Promise<AuthUser> => {
    const response = await $fetch<AuthResponse>(`${apiBase}/auth/login`, {
      method: 'POST',
      body: payload,
    })
    return applySession(response)
  }

  const register = async (payload: RegisterPayload): Promise<AuthUser> => {
    const response = await $fetch<AuthResponse>(`${apiBase}/auth/register`, {
      method: 'POST',
      body: payload,
    })
    return applySession(response)
  }

  const fetchMe = async (): Promise<AuthUser | null> => {
    if (!token.value) {
      user.value = null
      return null
    }
    try {
      const me = await $fetch<AuthUser>(`${apiBase}/users/me`, {
        headers: { Authorization: `Bearer ${token.value}` },
      })
      user.value = me
      return me
    } catch (error) {
      // Only clear on real auth failure; a transient network error keeps the token.
      if (statusOf(error) === 401) {
        token.value = null
        user.value = null
      }
      return null
    }
  }

  const logout = (): void => {
    token.value = null
    user.value = null
  }

  return {
    user,
    isLoggedIn,
    accessToken: token,
    login,
    register,
    fetchMe,
    logout,
  }
}
