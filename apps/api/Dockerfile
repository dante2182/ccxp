# syntax=docker/dockerfile:1

# Build: instala el workspace completo y compila solo la API con Nitro.
FROM node:24-slim AS build
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@12.23.0 --activate

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @ccxp/api build

# Runtime: solo el output de Nitro, sin toolchain ni fuentes.
FROM node:24-slim AS runtime
ENV NODE_ENV=production \
    PORT=3001

WORKDIR /app
RUN chown node:node /app

COPY --from=build --chown=node:node /app/apps/api/.output /app/.output

USER node
EXPOSE 3001

CMD ["node", ".output/server/index.mjs"]
