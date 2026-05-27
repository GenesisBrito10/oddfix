// Same-origin proxy → backend /surebets/** (includes the SSE /surebets/stream;
// proxyRequest streams the response so live push keeps working).
export default defineEventHandler((event) => {
  const target = useRuntimeConfig(event).apiProxyTarget as string
  return proxyRequest(event, target + event.path)
})
