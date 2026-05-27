# Oddfix — Architecture

## Overview

Oddfix surfaces surebets (arbitrage opportunities) sourced from BetBurger. The
backend (NestJS, DDD/Clean Architecture) ingests BetBurger data on a schedule,
normalizes it, and serves it to the Nuxt frontend.

```
BetBurger pro_search ──(internal scheduler/admin only)──► Backend
        │                                                    │
        │ normalize                                          │ Redis (snapshots, locks, rate limit, status)
        ▼                                                    ▼
   NormalizedSurebet ──────────────► Redis current/snapshot ──► GET /surebets/current ──► Nuxt frontend
                                                                                              │
   Postgres (permanent only) ◄── POST /surebets/register / history ◄────────────────────────┘
```

## Hard rules

- **BetBurger is never called by the frontend or by public endpoints** — only
  internal schedulers / admin endpoints.
- **Redis** holds temporary data only: current snapshots, per-snapshot
  snapshots (for register), distributed locks, hourly rate-limit counters, and
  integration status.
- **Postgres** holds permanent data only: users, BetBurger catalog (bookmakers,
  sports, market types), and user-registered surebets + legs. Temporary
  surebets are **never** persisted to Postgres.
- The BetBurger `access_token` is never hardcoded, committed, or logged.

## Backend layers (per module)

- `domain/` — entities, repository ports (abstract classes as DI tokens), pure
  services. No framework/Prisma imports.
- `application/` — use cases, contracts (request/response), mappers.
- `infrastructure/` — Prisma repositories, Redis caches, HTTP clients.
- `interfaces/http/` — controllers + DTOs (class-validator). Controllers only
  validate input and call use cases.

## Modules

- `auth` — register/login, bcrypt hashing, JWT issuance.
- `users` — current user (`GET /users/me`).
- `betburger` — HTTP client, catalog sync, Redis rate limiter / distributed
  lock / status cache.
- `surebets-current` — normalizer, Redis current/snapshot caches, refresh use
  case, `GET /surebets/current`.
- `registered-surebets` — `POST /surebets/register`, `GET /surebets/history*`,
  status/leg result updates (Postgres).
- `scheduler` — gated by `BETBURGER_SCHEDULER_ENABLED`.
- `common` — config, Prisma/Redis services, guards, decorators, health,
  error sanitizer + global exception filter.

## Data flow: register & history

1. `GET /surebets/current` reads the current Redis snapshot (no BetBurger call).
2. `POST /surebets/register` re-reads the temporary Redis snapshot by
   `snapshotId`, finds the arb by `arbHash`, and persists only that arb to
   Postgres (`registered_surebets` + `registered_surebet_legs`).
3. `GET /surebets/history*` + PATCH endpoints read/update only the logged-in
   user's rows (ownership enforced by `userId`).

## Frontend

Nuxt 4 + Vue 3. Composables wrap the API (`useAuth`, `useSurebetsApi`,
`useRegisterSurebet`, `useSurebetHistory`). `runtimeConfig.public.apiBase` is the
backend URL (`NUXT_PUBLIC_API_BASE`). Mock surebet data is a **dev-only**
fallback; in production the UI shows empty/errors instead of mock data.

## Real-time push (SSE)

`useSurebetsApi` subscribes to `GET /surebets/stream?type=` via
`@microsoft/fetch-event-source` (Bearer header). The refresh use-case publishes
each new snapshot to Redis (`surebets:updated:{type}`) the instant it writes the
current cache; `SurebetsStreamController` (`@Sse`) fans it out to subscribers via
`RedisPubSubService` — so the frontend updates with the same timing the backend
produces (no poll lag). Polling (`NUXT_PUBLIC_*_REFRESH_MS`) is a fallback when
SSE is off/unavailable.
