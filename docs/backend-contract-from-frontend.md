# Backend Contract — derived from existing frontend (Fase 0)

> **Scope of analysis:** the canonical frontend is `frontend/` (Nuxt 4 + Vue 3, `app/` dir).
> `oddfix-frontend/` is the Figma export (`@figma/my-make-file`, React) — **design reference only**, not wired to backend.
> `backend/` is a fresh NestJS scaffold (no domain code yet).
>
> **Rule for this phase:** nothing in the frontend was changed. This doc only describes the contract the backend must satisfy and the *minimal additive* changes needed later to swap mock → API. No layout/design changes.

---

## 1. Frontend map

### Routing (file-based, `frontend/app/pages/`)
| Route | File | Layout | Auth | Backend dependency |
|-------|------|--------|------|--------------------|
| `/` | `index.vue` | — | redirect | redirects to `/dashboard` or `/login` by auth state |
| `/login` | `login.vue` | `layout: false` | guest-only | **POST /auth/login** |
| `/register` | `register.vue` | `layout: false` | guest-only | **POST /auth/register** |
| `/cadastro` | `cadastro.vue` | — | guest-only | alias → redirects to `/register` |
| `/logout` | `logout.vue` | — | public | clears session client-side |
| `/dashboard` | `dashboard.vue` | default | **protected** | **GET /surebets/current?type=prematch** |
| `/live` | `live.vue` | default | **protected** | **GET /surebets/current?type=live** |
| `/account` | `account.vue` | default | protected | **GET /users/me** (rest of page = out of scope mock) |
| `/afiliados/*` | `afiliados/*` | default | protected | **out of scope** — stays mock |
| `/esqueci-senha` | *(missing page, route referenced)* | — | public | not implemented |

Global middleware `middleware/auth.global.ts`:
- guestOnlyRoutes = `/login`, `/register`, `/cadastro`
- publicRoutes = guestOnly + `/logout`, `/esqueci-senha`
- `/` → `/dashboard` if logged in else `/login`
- any non-public route while logged out → `/login`

### Components
- `components/layout/AppHeader.vue` — top tabs PRE-LIVE/LIVE, `signalCount` (hardcoded `274` in `layouts/default.vue`), PLATAFORMA/AFILIADOS toggle, user chip (hardcoded "João Silva / JS"), settings → `/account`.
- `components/layout/BottomNav.vue` — mobile nav: Pré-live, Live, Filtros, Mais.
- `components/layout/SidebarFilters.vue` — the filter panel (desktop sidebar + mobile sheet).
- `components/layout/AffiliateSidebar.vue` — shown on `/afiliados` + `/account`.
- `components/dashboard/SurebetCard.vue` — list item; emits `select`.
- `components/dashboard/SurebetDetailModal.vue` — right-side drawer; stake calculator; **only action button is "Abrir casas" (decorative)** — no register/save button exists.
- `components/BookmakerLogo.vue` — resolves logo by bookmaker **name** via `getBookmakerLogo`; falls back to name text.

### State / data sources
- `composables/useFakeAuth.ts` — **fake auth**, cookie `oddfix_fake_auth` = `{ name, email }`. No password, no token, no backend.
- `composables/useFilters.ts` — `useState` filter stores (pre-live + live, each has draft + applied copies).
- `data/surebets.ts` — **mock data** `mockSurebets` (pre-live) and `liveSurebets` (live), plus `Surebet`/`BetLeg` types and `formatCurrency`.
- `data/bookmakers.ts` — 9 hardcoded bookmakers `{ id, name, img, active }`.

---

## 2. Auth flow (current vs required)

### Current (mock)
- `login.vue`: submits `email` + `password`, but only calls `useFakeAuth().login({ email })` (password ignored), then `navigateTo('/dashboard')`.
- `register.vue`: fields `name, email, password, confirmPassword, referral, accepted`; calls `login({ name, email })` then `/dashboard`. No validation, no API.
- `logout.vue`: `useFakeAuth().logout()` → `/login`.
- Session = a non-httpOnly cookie holding `{name,email}`. No JWT.

### Required backend
| Endpoint | Request | Response (frontend needs) |
|----------|---------|---------------------------|
| `POST /auth/register` | `{ name, email, password, referralCode? }` | `{ accessToken, user: { id, name, email, role } }` |
| `POST /auth/login` | `{ email, password }` | `{ accessToken, user: { id, name, email, role } }` |
| `GET /users/me` | Bearer token | `{ id, name, email, role, createdAt }` |

**Never** return `passwordHash`.

### Minimal frontend changes (later phase, additive only)
- Replace `useFakeAuth` internals with a real `useAuth` composable: store `accessToken` (cookie) + fetched `user`; keep the same `isLoggedIn` / `user` / `login` / `logout` surface so `middleware`, `AppHeader`, `default.vue` keep working unchanged.
- Wire `login.vue` / `register.vue` submit handlers to call the API; show error state on failure (currently there is none).
- `AppHeader` user chip + `account.vue` profile should read from `useAuth().user` instead of hardcoded "João Silva".
- Out of scope / stays mock: OAuth buttons (Google/Apple/Mail), `account.vue` security/2FA/sessions/notifications/plano tabs, all `/afiliados/*`, `/esqueci-senha`.

---

## 3. Surebet data shape — frontend type vs backend normalized

### Frontend `Surebet` (must keep working)
```ts
interface BetLeg {
  bookmaker: string   // bookmaker NAME (used to resolve logo)
  market: string      // human market label
  odds: number
  stake: number       // computed client-side
  instrucoes: string  // breadcrumb text shown in card/modal
}
interface Surebet {
  id: string
  game: string                 // "Team1 vs. Team2"
  league: string
  time: string                 // display string, e.g. "AO VIVO - 67'", "Hoje às 13:00", "Começando em 15min"
  profitPct: number
  openingProfitPct?: number    // LIVE only, drives decay filter
  investment: number           // default stake, not from API
  returns: number              // computed
  sport: 'football' | 'basketball' | 'tennis'
  isNew?: boolean
  startsInMinutes: number      // drives 'start' sort
  legs: BetLeg[]
}
```

### Mapping: backend normalized (CLAUDE.md shape) → frontend `Surebet`
| Frontend field | Backend source | Notes / gap |
|----------------|----------------|-------------|
| `id` | `arbHash` | use arbHash as list key |
| `game` | `event.team1Name + ' vs. ' + event.team2Name` (fallback `event.name`) | |
| `league` | `event.leagueName` | |
| `time` | derive from `event.isLive`, `event.currentScore`, event start time | **needs backend to expose kickoff timestamp + isLive + currentScore**; frontend builds the display string |
| `profitPct` | `percent` | direct |
| `openingProfitPct?` | — | **no BetBurger source in snapshot** → optional/omit, or backend tracks first-seen percent per arbHash in Redis |
| `investment` | — | client default (`1000`), keep client-side |
| `returns` | — | compute client-side (`investment * (1 + profitPct/100)`); keep |
| `sport` | `event.sportId` / `event.sportName` | **frontend union too narrow** (only football/basketball/tennis). BetBurger has many (example sportId=1=Baseball). → widen `sport` to `string` + map known ids to icons, default fallback |
| `isNew?` | derive from `scanned_at` recency (or backend flag) | optional |
| `startsInMinutes` | from event start timestamp | needed for `sortBy: 'start'` (pre-live) |
| `legs[].bookmaker` | `legs[].bookmaker.name` | **must match a name in `data/bookmakers.ts` for logo**, else logo falls back to text (acceptable) |
| `legs[].market` | `legs[].market.name` | resolved via MarketType template |
| `legs[].odds` | `legs[].odd` | |
| `legs[].stake` | — | computed client-side in modal calculator; keep |
| `legs[].instrucoes` | **no direct BetBurger source** | derive e.g. `${sportName} › ${leagueName} › ${market.name}` or make optional; current mock value is a deep breadcrumb that BetBurger does not provide |

> **Recommended approach:** backend returns the normalized shape from CLAUDE.md (snapshotId, arbHash, event, legs, percent, odds...). Add a frontend adapter (e.g. `composables/useSurebets.ts`) that maps backend → existing `Surebet` type so `SurebetCard`/`SurebetDetailModal` stay untouched. Extend `Surebet`/`BetLeg` with optional fields (`arbHash`, `snapshotId`, `bookmakerUrl`, `currentScore`, `isLive`) rather than rewriting them.

### Extra fields the snapshot envelope must carry (for register flow + freshness UI)
`snapshotId`, `type` (LIVE/PREMATCH), `fetchedAt`, `expiresAt`, `isStale`, `total`, and per-surebet `arbHash` — required so the "register" action can reference `{ type, snapshotId, arbHash }`.

---

## 4. Filters → backend query params (Fase 8)

`FilterState` (in `useFilters.ts`) and how each is currently used in `dashboard.vue` / `live.vue`:

| Filter | UI control | Applied today? | Backend param suggestion |
|--------|-----------|----------------|--------------------------|
| `options` (2 \| 3) | option buttons | **yes** — `legs.length === options` | `legs=2\|3` |
| `profitRange` `[min,max]` | dual range 0–30 | **yes** — `profitPct` within range | `minPercent` / `maxPercent` |
| `selectedBookies` (names[]) | bookmaker grid | **yes** — surebet has any leg whose bookmaker ∈ selected | `bookmakers=` (names or externalIds) |
| `sortBy` (`profit`\|`recent`\|`start`) | select | **yes** — sort | `sort=` |
| `profitDecayTolerance` | range (live only) | **yes (live)** — vs `openingProfitPct` | needs `openingProfitPct` source |
| `investment` | money field | **no** (display only, feeds calculator default) | not a filter |
| `disabledMarkets` (ids[]) | market toggles | **NO — defined in UI but not applied** in filter logic | future: `excludeMarkets=` once market categories mapped |

Filtering today is **100% client-side over the full mock array**. Recommendation: keep client-side filtering over the snapshot (snapshot is small, per CLAUDE.md filters may run in-memory after Redis read), OR move to query params. Either works; client-side keeps frontend diff minimal.

Market filter ids currently in UI (not yet meaningful to backend): `handicap-gols`, `escanteios`, `reembolso-gols-hc`, `quartos`.

---

## 5. Bookmaker catalog (logo resolution)

`data/bookmakers.ts` hardcodes 9 houses, matched by **name**:
`Betnacional, Esportes da Sorte, Pixbet, Betpix365, Betão, Galerabet, OnaBet, REALS, Novibet`
(+ `active` flag controls default selected bookies in filters).

- Backend `Bookmaker.name` (resolved from BetBurger `directories.bookmaker_clones[].name`) **should match these display names** so logos resolve. Where names differ, `BookmakerLogo` falls back to text (no crash).
- Logos live in `frontend/public/imports/*.png`. Keep static.
- `bookmakerUrl` from backend can power the "Abrir casas" button (currently inert).

---

## 6. Endpoints the frontend will consume (summary)

Already needed by existing screens:
- `POST /auth/register`, `POST /auth/login`, `GET /users/me`
- `GET /surebets/current?type=live`
- `GET /surebets/current?type=prematch`

Needed for features that have **no UI yet** (must be added additively, Fases 9–10):
- `POST /surebets/register` — body `{ type, snapshotId, arbHash }`
- `GET /surebets/history`, `GET /surebets/history/:id`
- `PATCH /surebets/history/:id/status`
- `PATCH /surebets/history/:id/legs/:legId/result`

Admin/internal (no frontend UI, protected): catalog sync, refresh live/prematch, status.

---

## 7. Gaps — UI that does NOT exist yet (additive work, no redesign)

1. **Register/save surebet** — `SurebetDetailModal.vue` has only "Abrir casas". Need an additive button (e.g. "Registrar aposta") that POSTs `{ type, snapshotId, arbHash }` and shows success/error feedback (e.g. via a toast). Must read `type/snapshotId/arbHash` carried on the surebet object.
2. **History page** — no `/historico` route, no nav entry. Need a new page + a nav link (BottomNav "Mais" sheet and/or AffiliateSidebar/menu). Lists registered surebets from `GET /surebets/history`.
3. **GREEN/RED/VOID/CANCELLED marking** — no UI. Lives inside the new history page; per-leg + overall status controls calling the PATCH endpoints.
4. **Real auth** — replace fake cookie with token-based `useAuth`; wire login/register; surface validation errors (none today).
5. **Freshness / stale state** — header says "Atualizado agora" + hardcoded `274` signals. Optional: drive from snapshot `fetchedAt` / `total` / `isStale`.

Out of scope (stays mock, do not wire): affiliates module, account security/2FA/sessions/notifications/billing, OAuth login buttons, `/esqueci-senha`.

---

## 8. Compatibility quality gates for Fase 0

- [x] Canonical frontend identified (`frontend/`, Nuxt) — confirmed with user.
- [x] No layout/design changed.
- [x] No mock removed (no backend yet).
- [x] Contract document created (this file).
- [x] Mapping backend-normalized → frontend `Surebet` documented, with explicit gaps (`instrucoes`, `openingProfitPct`, `sport` union width, `time` string derivation).
- [x] Missing UI for register/history/green-red flagged as additive.
</content>
