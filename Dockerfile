# syntax=docker.io/docker/dockerfile:1

FROM oven/bun:latest AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on bun
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Copy environment files for build
COPY .env* ./

# Set build environment
ENV NODE_ENV=production
ENV BUILDING=true
ENV NEXT_TELEMETRY_DISABLED=1

# Apply DB migrations during build (if POSTGRES_URL is provided)
RUN set -a \
  && if [ -f .env.local ]; then . ./.env.local; fi \
  && if [ -f .env ]; then . ./.env; fi \
  && set +a \
  && if [ -n "$POSTGRES_URL" ]; then bun run db:push; fi

RUN bun run build

# Production image, copy all the files and run next
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install wget for healthcheck and create non-root user
RUN apt-get update && apt-get install -y --no-install-recommends wget \
  && rm -rf /var/lib/apt/lists/* \
  && groupadd -r -g 1001 nodejs \
  && useradd -r -u 1001 -g nodejs nextjs

# Copy environment files for runtime
COPY --from=builder --chown=nextjs:nodejs /app/.env* ./

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# server.js is created by next build from the standalone output
CMD ["node", "server.js"]
