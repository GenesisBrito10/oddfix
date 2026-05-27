/**
 * Restores the session on app init: if a token cookie exists but the user is
 * not loaded yet, fetch /users/me. Runs on server and client so SSR sees the
 * user. A 401 clears the stale token (handled inside fetchMe).
 */
export default defineNuxtPlugin(async () => {
  const { accessToken, user, fetchMe } = useAuth()
  if (accessToken.value && !user.value) {
    await fetchMe()
  }
})
