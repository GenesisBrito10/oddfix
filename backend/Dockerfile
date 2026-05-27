# syntax=docker/dockerfile:1
# Multi-stage production build for the Oddfix NestJS backend.
# No env values are baked in — they are provided at runtime (env_file / -e).

FROM node:24-alpine AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable
WORKDIR /app

# ---- install all deps (incl. dev, needed to build + prisma generate) ----
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ---- build: generate Prisma client + compile NestJS ----
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm prisma generate && pnpm build

# ---- runner: non-root, production start ----
FROM base AS runner
ENV NODE_ENV=production
# node_modules kept whole so `prisma migrate deploy` is available at deploy time.
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY package.json pnpm-lock.yaml ./
USER node
EXPOSE 3001
CMD ["node", "dist/main.js"]
