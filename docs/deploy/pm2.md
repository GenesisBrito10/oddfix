# PM2 (optional — non-Docker)

Docker is the default deploy path (`backend-deploy.md`). Use PM2 only when
running the backend directly on a host.

## Build + migrate

```bash
cd backend
pnpm install --frozen-lockfile
pnpm prisma:generate
pnpm prisma:migrate:deploy
pnpm build
```

## ecosystem.config.js (optional)

```js
module.exports = {
  apps: [
    {
      name: 'oddfix-backend',
      script: 'dist/main.js',
      cwd: '/var/www/oddfix/backend',
      instances: 1,
      env: {
        NODE_ENV: 'production',
      },
      // env values come from the process environment / a sourced .env
    },
  ],
};
```

## Run

```bash
pm2 start ecosystem.config.js        # or: pm2 start dist/main.js --name oddfix-backend
pm2 save                              # persist process list
pm2 startup                           # generate boot script (run the printed command)
pm2 install pm2-logrotate             # rotate logs
```

## Notes

- Load env from a sourced `.env` or systemd; do not commit secrets.
- Behind Nginx (see `nginx.md`); bind the app to localhost.
- Single instance is fine for the MVP scheduler (the distributed lock guards
  refresh, but avoid running multiple schedulers without review).
