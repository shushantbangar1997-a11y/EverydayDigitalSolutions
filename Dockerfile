# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare pnpm@10.26.1 --activate

WORKDIR /app

# Copy workspace manifests first (layer cache friendly)
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy every workspace package pnpm needs to resolve the graph
COPY artifacts/eds-site ./artifacts/eds-site
COPY lib ./lib
COPY scripts ./scripts

# Install all workspace deps (lockfile used as-is — no network resolution)
RUN pnpm install --frozen-lockfile

# Build the static bundle
RUN pnpm --filter @workspace/eds-site run build

# ── Stage 2: Serve ──────────────────────────────────────────────────────────
FROM node:20-alpine

RUN npm install -g serve

WORKDIR /app

COPY --from=builder /app/artifacts/eds-site/dist/public ./public

EXPOSE 3000

# Railway injects PORT at runtime; default to 3000 for local docker run
CMD ["sh", "-c", "serve -s public -l ${PORT:-3000}"]
