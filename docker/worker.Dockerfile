# ============================================
# Cronbot Worker (NestJS) — Docker Image
# Build: docker build -f Dockerfile.worker -t cronbot-worker .
# ============================================

FROM node:24-alpine AS base
RUN corepack enable pnpm

# -----------------------------------------------------------
# Stage 1: Prune monorepo to only what "worker" needs
# -----------------------------------------------------------
FROM base AS pruner
WORKDIR /app
RUN pnpm add -g turbo@^2
COPY . .
RUN turbo prune worker --docker

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
ENV NODE_OPTIONS="--max-old-space-size=8192"

COPY --from=pruner /app/out/full/ .
COPY --from=deps /app/node_modules ./node_modules
RUN pnpm install --frozen-lockfile && pnpm run build --filter=worker

# -----------------------------------------------------------
# Stage 4: Production runner
# -----------------------------------------------------------
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/worker/dist ./dist
COPY --from=builder /app/apps/worker/node_modules ./node_modules
COPY --from=builder /app/apps/worker/package.json ./

USER nextjs
EXPOSE 3000
ENV PORT=3000

CMD ["node", "dist/main.js"]
