# Oddfix — Operations

> Admin endpoints require a JWT from a user with role `ADMIN`. Public/user
> endpoints require any authenticated user. The BetBurger token lives only in
> the backend env — never sent from the browser.

## Promote a user to admin

There is no self-serve admin promotion. Update the row directly in Postgres:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'you@example.com';
```

(Inside Docker: `docker compose -f docker-compose.prod.yml exec postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "..."`)

## Run BetBurger catalog sync (admin)

Populates bookmakers / sports / market types in Postgres.

```
POST /admin/betburger/sync-catalog
Authorization: Bearer <admin token>
```

## Manual refresh (admin)

Fetches BetBurger, normalizes, writes Redis current + snapshot. Respects the
hourly rate limiter and the distributed lock.

```
POST /admin/betburger/refresh/live
POST /admin/betburger/refresh/prematch
Authorization: Bearer <admin token>
```

## Scheduler

Automatic refresh runs only when `BETBURGER_SCHEDULER_ENABLED=true`. Keep it
`false` until catalog sync has run and rate limits are understood.

## Check status

- `GET /health` — api/postgres/redis + `betburger.schedulerEnabled` and last
  live/prematch integration status (no secrets).
- `GET /admin/betburger/status` (admin) — detailed integration status.
- Per-type status key in Redis: `betburger:status:{live|prematch}`.

## Inspect / clear Redis (use with care)

```
# keys
redis-cli KEYS 'surebets:*'
redis-cli KEYS 'betburger:*'

# current snapshot for a type
redis-cli GET 'surebets:current:live'

# clear a stuck temporary snapshot (will be rebuilt on next refresh)
redis-cli DEL 'surebets:snapshot:live:<snapshotId>'
```

Never delete Postgres rows to "reset" surebets — registered surebets are user
data. Redis snapshots are safe to drop; they are rebuilt by refresh.

## User-facing endpoints (reference)

- `POST /auth/register`, `POST /auth/login`, `GET /users/me`
- `GET /surebets/current?type=live|prematch`
- `POST /surebets/register`
- `GET /surebets/history`, `GET /surebets/history/:id`
- `PATCH /surebets/history/:id/status`
- `PATCH /surebets/history/:id/legs/:legId/result`
