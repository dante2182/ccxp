# CCIP — workspace pnpm (Nuxt 4 + Nitro)

Monorepo con dos aplicaciones desplegables por separado:

- `apps/web`: frontend Nuxt 4 con SSR en `http://localhost:3000`.
- `apps/api`: API Nitro standalone en `http://localhost:3001`.

## Requisitos

- Node.js `>=24`
- pnpm `12.23.0` (`corepack enable`)

## Comandos

```bash
pnpm install
pnpm dev                       # solo web; en desarrollo /api se proxea a :3001
pnpm --filter @ccxp/api dev    # API en :3001
pnpm build                     # build de api + web
pnpm typecheck
pnpm lint
pnpm format
pnpm format:check
pnpm test

# Deploy (VPS con Docker)
pnpm deploy:up
pnpm deploy:ps
pnpm deploy:logs
pnpm deploy:restart
pnpm deploy:down
```

Para levantar ambas apps en desarrollo, ejecuta en dos terminales:

```bash
pnpm --filter @ccxp/api dev
pnpm dev
```

## Estructura

```text
apps/api/
├── routes/api/               # rutas públicas (/api/**)
├── src/
│   ├── config/               # env validada y logger pino
│   ├── modules/              # contact, ubigeo (service + repository + controller)
│   └── shared/               # utilidades puras
└── Dockerfile                # build → .output/server/index.mjs

apps/web/
├── app/
│   ├── components/base/      # BaseButton, BaseInput, BaseSelect, BaseModal, BaseCard
│   ├── features/             # contact, layout (componentes + CSS por feature)
│   ├── pages/                # rutas SSR
│   ├── composables/          # estado UI y acceso a datos
│   ├── styles/tokens.css     # tokens de diseño
│   └── data/                 # JSON estático de contenido
├── public/                   # imágenes, fuentes, robots.txt, sitemap.xml
├── nuxt.config.ts            # proxy /api/** y runtimeConfig público
└── Dockerfile                # build → .output/server/index.mjs

packages/
├── contracts/                # esquemas Zod compartidos
└── config/                   # tsconfig, ESLint y Prettier compartidos

deploy/
├── docker-compose.yml        # web + api + nginx (+ certbot opcional)
├── nginx/ccip.conf           # TLS, /api, /health, caché y headers
└── README.md                 # runbook completo
```

## Contrato actual de la API

| Método | Ruta                               | Respuesta                                           |
| ------ | ---------------------------------- | --------------------------------------------------- |
| `GET`  | `/api/ubigeo/departamentos`        | `string[]`                                          |
| `GET`  | `/api/ubigeo/provincias/:dep`      | `string[]`                                          |
| `GET`  | `/api/ubigeo/distritos/:dep/:prov` | `string[]`                                          |
| `POST` | `/api/contacto`                    | `{ success: true }` o `{ success: false, message }` |

El body de `POST /api/contacto` acepta: `tipo`, `nombres`, `apellidos`, `dni`, `telefono`, `email`, `empresa`, `mensaje`, `departamento`, `provincia` y `distrito`.

El proxy `/api/**` existe en Nuxt porque el SSR resuelve `$fetch('/api/...')` contra el propio Nitro. Por defecto apunta a `http://localhost:3001`; en el VPS se define `NUXT_API_TARGET=http://api:3001` al compilar la web. Nginx además enruta el tráfico externo `/api` directamente al contenedor de la API.

## Configuración

Copia `.env.example` a `.env` y rellena los valores SMTP en el servidor. **No se ha movido al repo ninguna credencial antigua**: la app password expuesta en el historial debe rotarse en el proveedor de correo.

## Convenciones

- **Feature folders:** componentes y CSS de una misma responsabilidad viven juntos en `app/features/<feature>/`.
- **Componentes base:** `Base*` con slots/variants y a11y; el CSS de cada feature conserva la apariencia.
- **Backend:** controladores delgados → servicios → repositorios; la configuración se valida al arrancar.
- **Tipos:** contratos Zod en `packages/contracts`; sin `any` ni `@ts-ignore` en código nuevo.
- **Secretos:** solo en `.env` del servidor; `.env.example` contiene únicamente nombres y placeholders.
- **Estilo:** Prettier + ESLint compartidos; commitear solo después de `format:check`, `typecheck`, `lint` y `test`.

## Deploy y rollback

Preparación inicial, certificados, arranque, verificación y rollback están en [`deploy/README.md`](deploy/README.md). Resumen:

```bash
cp .env.example .env
# rellenar SMTP y dominio, y reemplazar tu-dominio.com en nginx/sitemap/robots
pnpm deploy:up
curl https://tu-dominio.com/health
```

El backend se ejecuta como usuario no root con `NODE_ENV=production`; Nginx enruta `/api` y `/health` directamente a la API, además del proxy SSR interno de Nuxt.

## Evaluación de TypeScript 7

Se probó `typescript@7.0.2` de forma aislada y se descartó: `vue-tsc@3.3.14` intenta resolver
`typescript/lib/tsc`, una subruta que TypeScript 7 ya no exporta
(`ERR_PACKAGE_PATH_NOT_EXPORTED`). Se mantuvo `typescript@5.9.3` sin `any` ni `@ts-ignore`.

## Estado del plan

Fases 0–10 ejecutadas y verificadas; ver `ANALISIS_Y_PLAN_DE_MIGRACION.md` y `deploy/README.md` para el detalle. Pendiente fuera del repo: confirmar dominio productivo, rotar la credencial expuesta en el historial y aprobación visual del usuario. `demo/` no se tocó ni se incluye en el deploy.
