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
COPY lib ./lib
COPY scripts ./scripts

# Stub attached_assets so the @assets vite alias resolves without error
RUN mkdir -p ./attached_assets

# Install all workspace deps (lockfile used as-is — no network resolution)
RUN pnpm install --frozen-lockfile

# Build from within the package directory so relative paths resolve correctly
WORKDIR /app/artifacts/eds-site
RUN NODE_ENV=production pnpm run build

# ── Stage 2: Serve ──────────────────────────────────────────────────────────
FROM node:20-slim

RUN npm install -g serve

WORKDIR /app

COPY --from=builder /app/artifacts/eds-site/dist/public ./public

EXPOSE 3000

# Railway injects PORT at runtime; default to 3000 for local docker run
CMD ["sh", "-c", "serve -s public -l ${PORT:-3000}"]
