// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  // Don't ship source maps — they map minified output back to readable source.
  sourcemap: { server: false, client: false },
  // Minify the Nitro server bundle that ships inside the desktop app.
  nitro: { minify: true },
  // Pin the frontend dev server port (default 3000) so it never grabs the
  // backend's port (3001). Override with PORT in .env.
  devServer: { port: Number(process.env.PORT) || 3000 },
  // Vite dev server host allowlist (ngrok tunnel + local alias). The error
  // "add to server.allowedHosts" comes from Vite — it lives under vite.server.
  vite: {
    server: {
      allowedHosts: ['inconclusive-chadwick-unclayed.ngrok-free.dev', 'oddfix.local'],
    },
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    // Server-only (never sent to the client) — the real backend origin the
    // Nitro proxy routes forward to. Keeps the backend hidden + avoids CORS.
    apiProxyTarget: process.env.NUXT_API_PROXY_TARGET || 'http://localhost:3001',
    public: {
      // Empty = same-origin. Requests hit the Nitro proxy under server/routes
      // (/auth, /users, /catalog, /surebets) — no CORS, backend not exposed.
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '',
      // Real-time push via SSE (default on). When connected, the backend pushes
      // each snapshot the instant it's produced — identical timing, no poll lag.
      streamEnabled: process.env.NUXT_PUBLIC_STREAM_ENABLED || 'true',
      // Polling fallback cadence (ms) — used only if SSE is off/unavailable.
      // Keep in lockstep with backend BETBURGER_*_SYNC_INTERVAL_MS (live 3000 /
      // prematch 6000).
      liveRefreshMs: process.env.NUXT_PUBLIC_LIVE_REFRESH_MS || '3000',
      prematchRefreshMs: process.env.NUXT_PUBLIC_PREMATCH_REFRESH_MS || '6000',
    },
  },
})
