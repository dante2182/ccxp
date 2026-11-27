# syntax=docker/dockerfile:1

# Build: el proxy SSR se resuelve en tiempo de compilación, por eso
# NUXT_API_TARGET se declara como ARG y debe apuntar al servicio api.
FROM node:24-slim AS build
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@12.23.0 --activate

COPY . .

RUN pnpm install --frozen-lockfile

ARG NUXT_API_TARGET=http://api:3001
ENV NUXT_API_TARGET=$NUXT_API_TARGET \
    NODE_ENV=production

RUN pnpm --filter @ccxp/web build

# Runtime: solo el output de Nuxt/Nitro.
FROM node:24-slim AS runtime
ENV NODE_ENV=production \
    PORT=3000

WORKDIR /app
RUN chown node:node /app

COPY --from=build --chown=node:node /app/apps/web/.output /app/.output

USER node
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
