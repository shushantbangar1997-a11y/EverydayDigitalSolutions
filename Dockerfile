# ── Stage 1: Build ──────────────────────────────────────────────────────────
# node:20-slim is Debian-based (glibc/gnu). The pnpm-workspace.yaml overrides
# exclude musl variants of rollup, @tailwindcss/oxide, and lightningcss —
# Alpine uses musl and would break. Debian uses gnu, which is kept.
FROM node:20-slim AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare pnpm@10.26.1 --activate

WORKDIR /app

# ── Workspace manifests + root TypeScript configs ──
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
# eds-site/tsconfig.json extends ../../tsconfig.base.json — must be present
COPY tsconfig.base.json tsconfig.json ./

# ── Workspace packages ──
COPY artifacts/eds-site ./artifacts/eds-site
COPY artifacts/api-server ./artifacts/api-server
COPY lib ./lib
COPY scripts ./scripts

# Stub attached_assets so the @assets vite alias resolves without error
RUN mkdir -p ./attached_assets

# Install all workspace deps (lockfile used as-is — no network resolution)
RUN pnpm install --frozen-lockfile

# Build the frontend
WORKDIR /app/artifacts/eds-site
RUN NODE_ENV=production pnpm run build

# Build the api-server (esbuild bundle)
WORKDIR /app/artifacts/api-server
RUN pnpm run build

# ── Stage 2: Runtime ────────────────────────────────────────────────────────
# The api-server serves /api/* dynamically AND the prerendered static site
# (everything else falls through to index.html via SPA fallback).
FROM node:20-slim

WORKDIR /app

# Copy the entire built workspace so geoip-lite's data files and any
# externalized deps remain resolvable at runtime.
COPY --from=builder /app /app

ENV PUBLIC_DIR=/app/artifacts/eds-site/dist/public
ENV NODE_ENV=production

WORKDIR /app/artifacts/api-server

EXPOSE 3000

# Railway injects PORT at runtime
CMD ["node", "--enable-source-maps", "./dist/index.mjs"]
