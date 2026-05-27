# Backend Deploy

## Environment variables

Copy `backend/.env.example` to `backend/.env` and set real values. Key ones:

| Var | Notes |
| --- | --- |
| `NODE_ENV` | `production` |
| `PORT` | default `3001` |
| `DATABASE_URL` | Postgres URL. In Docker compose use host `postgres` (e.g. `postgresql://oddfix_user:***@postgres:5432/oddfix_db?schema=public`) |
| `REDIS_HOST` / `REDIS_PORT` / `REDIS_PASSWORD` | in Docker compose use host `redis` |
| `JWT_SECRET` | **required in production** — long random string |
| `JWT_EXPIRES_IN` | e.g. `7d` |
| `CORS_ORIGINS` | comma-separated; must include the frontend domain; no `*` in prod |
| `CORS_CREDENTIALS` | `true` |
| `AUTH_THROTTLE_TTL_SECONDS` / `AUTH_THROTTLE_LIMIT` | login/register rate limit |
| `BETBURGER_ACCESS_TOKEN` | required only if running real refresh/scheduler |
| `BETBURGER_SCHEDULER_ENABLED` | keep `false` until ready |
| `POSTGRES_DB` / `POSTGRES_USER` / `POSTGRES_PASSWORD` | used by the compose postgres service |

`validateEnv` aborts boot in production if `JWT_SECRET` is missing or
`CORS_ORIGINS` is empty / contains `*`.

## Option A — Docker Compose (recommended)

```bash
cd backend
cp .env.example .env   # then edit .env
docker compose -f docker-compose.prod.yml up -d --build
```

The backend service runs `prisma migrate deploy` then `node dist/main.js`.
Postgres/Redis have no published host ports; the backend is bound to
`127.0.0.1:3001` for Nginx.

## Option B — Manual / single image

```bash
cd backend
docker build -t oddfix-backend:latest .
# run migrations once (against the prod DB), then start:
docker run --rm --env-file .env oddfix-backend:latest pnpm prisma migrate deploy
docker run -d --env-file .env -p 127.0.0.1:3001:3001 oddfix-backend:latest
```

## Prisma in production

- **Dev**: `pnpm prisma migrate dev`
- **Prod**: `pnpm prisma:migrate:deploy` (alias for `prisma migrate deploy`)
  then start. Never `prisma db push` in production.

## Post-deploy

1. `curl -s https://api.yourdomain.com/health` → `status: ok`.
2. Promote an admin (see `operations.md`).
3. Run catalog sync (admin).
4. Optionally enable the scheduler.

See `nginx.md` for the reverse proxy, `pm2.md` for the non-Docker option, and
`../PRODUCTION_CHECKLIST.md` before going live.
