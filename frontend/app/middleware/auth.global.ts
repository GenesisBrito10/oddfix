export default defineNuxtRouteMiddleware((to) => {
  const { isLoggedIn } = useAuth()

  const guestOnlyRoutes = ['/login', '/register', '/cadastro']
  const publicRoutes = [...guestOnlyRoutes, '/logout', '/esqueci-senha']

  if (to.path === '/') {
    return navigateTo(isLoggedIn.value ? '/dashboard' : '/login', { replace: true })
  }

  if (guestOnlyRoutes.includes(to.path) && isLoggedIn.value) {
    return navigateTo('/dashboard', { replace: true })
  }

  if (!publicRoutes.includes(to.path) && !isLoggedIn.value) {
    return navigateTo('/login', { replace: true })
  }
})
