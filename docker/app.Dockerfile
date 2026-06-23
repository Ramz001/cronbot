# ============================================
# Cronbot Dashboard (Next.js) — Docker Image
# Build: docker build -t cronbot-app .
# ============================================

FROM node:24-alpine AS base
RUN corepack enable pnpm

# -----------------------------------------------------------
# Stage 1: Prune monorepo to only what "app" needs
# -----------------------------------------------------------
FROM base AS pruner
WORKDIR /app
RUN pnpm add -g turbo@^2
COPY . .
RUN turbo prune app --docker

# -----------------------------------------------------------
# Stage 2: Install dependencies (from pruned lockfile)
# -----------------------------------------------------------
FROM base AS deps
WORKDIR /app
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile --prod

# -----------------------------------------------------------
# Stage 3: Build the application
# -----------------------------------------------------------
FROM base AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=8192"

COPY --from=pruner /app/out/full/ .
COPY --from=deps /app/node_modules ./node_modules
RUN pnpm install --frozen-lockfile && pnpm run build --filter=app

# -----------------------------------------------------------
# Stage 4: Production runner (standalone Next.js output)
# -----------------------------------------------------------
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/app/.next/standalone ./
COPY --from=builder /app/apps/app/.next/static ./apps/app/.next/static
COPY --from=builder /app/apps/app/public ./apps/app/public

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "apps/app/server.js"]
