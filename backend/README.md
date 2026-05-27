# Oddfix Backend

NestJS + TypeScript + Prisma (PostgreSQL) + Redis backend for the Oddfix
surebets platform. Built with a DDD / Clean Architecture layout.

> **Status:** MVP complete — auth (JWT), BetBurger catalog sync + live/prematch
> refresh, Redis snapshots/locks/rate-limit, `GET /surebets/current`, register +
> history (GREEN/RED/VOID/CANCELLED), and production hardening (Helmet, CORS,
> auth throttling, error sanitization, Dockerfile, prod compose, docs).

## Documentation

- Architecture: [`../docs/architecture.md`](../docs/architecture.md)
- Security: [`../docs/security.md`](../docs/security.md)
- Operations (admin/sync/refresh/status): [`../docs/operations.md`](../docs/operations.md)
- Deploy: [`../docs/deploy/backend-deploy.md`](../docs/deploy/backend-deploy.md),
  [`nginx`](../docs/deploy/nginx.md), [`pm2`](../docs/deploy/pm2.md)
- Go-live: [`../docs/PRODUCTION_CHECKLIST.md`](../docs/PRODUCTION_CHECKLIST.md)

## Stack

- NestJS 11 (CommonJS build)
- TypeScript 5
- Prisma 6 + PostgreSQL 16
- Redis 7 (via `ioredis`)
- Docker / Docker Compose
- pnpm

## Requirements

- Node.js 20+ (repo uses Node 24 types)
- pnpm
- Docker + Docker Compose

## Setup

```bash
# 1. install dependencies
pnpm install

# 2. create your local env from the template (never commit the real .env)
cp .env.example .env

# 3. start Postgres + Redis
docker compose up -d

# 4. generate the Prisma client
pnpm prisma generate

# 5. run the API in watch mode
pnpm start:dev
```

The API listens on `PORT` (default `3001`).

## Health check

```bash
curl http://localhost:3001/health
```

Returns a structured report (always HTTP 200; dependency outages show as
`status: degraded` instead of crashing the app):

```json
{
  "status": "ok",
  "timestamp": "2026-05-24T03:31:50.840Z",
  "services": { "api": "ok", "postgres": "ok", "redis": "ok" },
  "betburger": { "schedulerEnabled": false, "live": "SUCCESS", "prematch": "SUCCESS" }
}
```

## Production

Multi-stage `Dockerfile` + `docker-compose.prod.yml` (backend + postgres +
redis; DB/Redis not published, backend bound to `127.0.0.1:3001` for Nginx):

```bash
cp .env.example .env   # set JWT_SECRET, CORS_ORIGINS (no "*"), DATABASE_URL, etc.
docker compose -f docker-compose.prod.yml up -d --build
```

The backend runs `prisma migrate deploy` then `node dist/main.js`. Full guide:
[`../docs/deploy/backend-deploy.md`](../docs/deploy/backend-deploy.md). In
production the app refuses to boot without `JWT_SECRET` or with an empty / `*`
`CORS_ORIGINS`.

## Docker services

`docker-compose.yml` provides:

| Service  | Image             | Host port | Container         |
|----------|-------------------|-----------|-------------------|
| Postgres | postgres:16-alpine| `5433`    | `oddfix_postgres` |
| Redis    | redis:7-alpine    | `6379`    | `oddfix_redis`    |

Default DB credentials (dev only): `oddfix_user` / `oddfix_pass` / `oddfix_db`.

```bash
docker compose up -d        # start
docker compose ps           # status
docker compose logs -f      # logs
docker compose down         # stop (keeps volumes)
docker compose down -v      # stop + wipe data
```

## Useful commands

```bash
pnpm start:dev        # dev server (watch)
pnpm start            # dev server
pnpm build            # compile to dist/
pnpm start:prod       # run compiled build
pnpm lint             # eslint --fix
pnpm format           # prettier --write
pnpm test             # unit tests
pnpm test:e2e         # e2e tests
pnpm prisma generate  # regenerate Prisma client
```

## Environment variables

See [`.env.example`](./.env.example) for the full list. Groups:

- **app** — `NODE_ENV`, `PORT`
- **database** — `DATABASE_URL`
- **redis** — `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`
- **jwt** — `JWT_SECRET` (required in prod), `JWT_EXPIRES_IN`
- **cors** — `CORS_ORIGINS` (allowlist, required in prod, no `*`), `CORS_CREDENTIALS`
- **throttle** — `AUTH_THROTTLE_TTL_SECONDS`, `AUTH_THROTTLE_LIMIT` (login/register)
- **betburger** — token, base URLs, sync intervals, hourly limits, snapshot
  TTLs, HTTP timeout, `BETBURGER_SCHEDULER_ENABLED`

Secrets are never logged and never hardcoded — all values come from env.
Errors are sanitized (`access_token`/JWT/password/DB URL/Redis password) and
stack traces are logged only outside production.

## Project structure (DDD)

```
src/
  main.ts
  app.module.ts
  common/
    config/        # namespaced config + env validation
    database/      # PrismaModule / PrismaService
    redis/         # RedisModule / RedisService
    health/        # GET /health
    logger/ errors/ guards/ decorators/ http/
  modules/
    auth/ users/ betburger/ surebets-current/
    registered-surebets/ scheduler/
      domain/ application/ infrastructure/ interfaces/
```

Layering rules: controllers call use-cases; use-cases orchestrate; infrastructure
implements Prisma/Redis/HTTP access; the domain layer stays free of NestJS,
Prisma, Redis and Axios.
