# Oddfix — Security

## Secrets & tokens

- **BetBurger `access_token`**: from `BETBURGER_ACCESS_TOKEN` only. Never
  hardcoded, committed, or logged. Status messages and error logs are passed
  through `sanitizeMessage` (`access_token=***`).
- **JWT**: signed with `JWT_SECRET`. Required in production — the app refuses to
  boot without it (`validateEnv`). Passwords are bcrypt-hashed (`bcryptjs`),
  never stored or logged in plaintext.
- **`.env`** is git-ignored; `.env.example` carries no secrets.
- Do not run `docker compose -f docker-compose.prod.yml config` where the output
  is shared — it interpolates `.env` values.

## Error sanitization

`AllExceptionsFilter` (global) returns sanitized payloads and a generic
`500 Internal server error` for unexpected errors. Stack traces are logged only
when `NODE_ENV !== production`. `sanitizeMessage`/`sanitizePayload`
(`src/common/errors/error-sanitizer.ts`) redact `access_token`, Bearer JWTs,
password fields, Postgres URLs, and Redis passwords.

## CORS

- Configured from `CORS_ORIGINS` (comma-separated allowlist) +
  `CORS_CREDENTIALS`.
- Production: `validateEnv` requires at least one explicit origin and rejects
  the `*` wildcard. Dev reflects the request origin for convenience.

## Rate limiting

- `@nestjs/throttler` limits `POST /auth/login` and `POST /auth/register`
  (`AUTH_THROTTLE_TTL_SECONDS` / `AUTH_THROTTLE_LIMIT`). Applied only on
  `AuthController` — `/surebets/current` and the scheduler are unaffected.
- The BetBurger hourly rate limiter (live 1800/h, prematch 700/h) is a separate
  internal mechanism in Redis.

## Network exposure

- In production (`docker-compose.prod.yml`) Postgres and Redis have **no
  published host ports** — reachable only on the internal Docker network.
- The backend binds to `127.0.0.1:3001`; Nginx terminates TLS and proxies.
- HTTPS is mandatory in production.

## Cookies / frontend auth

- The frontend stores the JWT in the `oddfix_token` cookie. It is **not
  httpOnly** because the SPA must read it to send the `Authorization: Bearer`
  header.
- `sameSite=lax`; `secure=true` in production (HTTPS); `maxAge` ≈ `JWT_EXPIRES_IN`.

### Known limitation / future hardening

A non-httpOnly cookie is readable by JS (XSS risk). Post-MVP hardening:

- Move the token to an **httpOnly** cookie.
- Add a **Nuxt server-side proxy / BFF** that attaches the token server-side so
  the browser never holds it.
- Add **CSRF protection** once auth moves to cookie-based server calls.

## Real-time stream (SSE)

- `GET /surebets/stream` is `JwtAuthGuard`-protected — anonymous/external clients
  get 401, so they cannot connect or scrape the feed.
- Auth via `Authorization: Bearer` header (frontend uses
  `@microsoft/fetch-event-source`, since native `EventSource` cannot send
  headers) → token never in the URL/logs. Reuses the same guard as REST.
- CORS allowlist + HTTPS apply as usual.
- Known gap: an authenticated user can still read their own stream — transport
  auth does not stop that. Mitigation (post-MVP): per-user connection cap +
  rate limit on the stream route + abuse monitoring.

## Headers

`helmet()` is enabled in `main.ts` for baseline security headers.
