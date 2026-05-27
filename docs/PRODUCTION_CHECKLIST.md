# Production Checklist

Run through before going live:

- [ ] `NODE_ENV=production`
- [ ] `JWT_SECRET` strong + configured
- [ ] `BETBURGER_ACCESS_TOKEN` configured (if real refresh/scheduler is used)
- [ ] `DATABASE_URL` production configured (host `postgres` in compose)
- [ ] Redis configured (host `redis` in compose; password if exposed)
- [ ] `CORS_ORIGINS` set to the real frontend domain(s), no `*`
- [ ] HTTPS active (certbot) on api + app domains
- [ ] Migrations run (`prisma migrate deploy`)
- [ ] Catalog sync run (admin)
- [ ] Admin user created / promoted
- [ ] Scheduler enabled only when safe (`BETBURGER_SCHEDULER_ENABLED=true`)
- [ ] Logs reviewed — no token / secret leakage
- [ ] Postgres/Redis not exposed publicly (no published host ports / firewalled)
- [ ] Postgres backup configured
- [ ] Basic monitoring on `/health`
- [ ] Frontend `NUXT_PUBLIC_API_BASE` set to the real API domain
- [ ] Verified frontend does not show mock data in production
