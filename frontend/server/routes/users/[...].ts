// Same-origin proxy → backend /users/**.
export default defineEventHandler((event) => {
  const target = useRuntimeConfig(event).apiProxyTarget as string
  return proxyRequest(event, target + event.path)
})
