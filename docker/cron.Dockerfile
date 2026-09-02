# ============================================
# Cronbot Cron Script (node-cron) — Docker Image
# Runs apps/cron-script/cron.js as a long-lived scheduler (UTC).
# Build: docker build -f docker/cron.Dockerfile -t cronbot-cron .
# ============================================

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV TZ=UTC

COPY apps/cron-script/package.json ./
RUN npm install --omit=dev --no-package-lock

# Copy only the source files (not local node_modules symlinks).
COPY apps/cron-script/cron.js apps/cron-script/send-message.js ./

CMD ["node", "cron.js"]
