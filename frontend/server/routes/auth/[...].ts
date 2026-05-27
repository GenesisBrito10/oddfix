// Same-origin proxy → backend /auth/**. Hides the backend origin and avoids
// browser CORS/preflight. proxyRequest forwards method, body, headers + streams.
export default defineEventHandler((event) => {
  const target = useRuntimeConfig(event).apiProxyTarget as string
  return proxyRequest(event, target + event.path)
})
