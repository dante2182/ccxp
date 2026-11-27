# CCIP — workspace pnpm (Nuxt 4 + Nitro)

Monorepo con dos aplicaciones desplegables por separado y un demo visual que será el futuro frontend:

- `apps/web`: frontend Nuxt 4 con SSR en `http://localhost:3000`.
- `apps/api`: API Nitro standalone en `http://localhost:3001`.
- `experiment/`: demo visual aprobado ya traducido a Nuxt 4 + Vue 3; se migra a `apps/web` en etapas posteriores.
- `demo/`: demo histórico, intacto y excluido del deploy.

## Requisitos

- Node.js `>=24`
- pnpm `12.23.0` (`corepack enable`) para el workspace
- npm para trabajar dentro de `experiment/` (está fuera de `pnpm-workspace.yaml`)

## Arranque rápido

Workspace:

```bash
pnpm install
pnpm --filter @ccxp/api dev   # terminal 1: API en :3001
pnpm dev                      # terminal 2: web en :3000, /api se proxea a :3001
```

Demo visual:

```bash
cd experiment
npm ci
npm run dev                   # http://localhost:3000
```

## Comandos del workspace

```bash
pnpm build                    # build de api + web
pnpm generate                 # generate de la web
pnpm typecheck
pnpm lint
pnpm lint:fix
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

## Comandos de `experiment/`

```bash
npm run build
npm run preview
npm run typecheck
npm run lint
npm run lint:fix
npm run format
npm run format:check
npm audit --audit-level moderate
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
│   ├── styles/               # tokens.css (runtime) + tokens.scss (Sass)
│   ├── assets/css/tailwind.css # Tailwind v4 sin preflight
│   ├── utils/                # logger centralizado
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

experiment/                   # demo visual, fuera del workspace pnpm
├── app/                      # Nuxt 4: features, UI base, composables y estilos
├── src/                      # fuentes React/Vite originales (congeladas)
├── qa/baseline/              # golden visual congelado
├── nuxt.config.ts            # preflight de Tailwind conservado
└── package.json              # toolchain npm propia

demo/                         # demo histórico, no se tocó
```

## Demo visual (`experiment/`)

Es la traducción completa del demo aprobado a **Nuxt 4.7.0 + Vue 3.5.46**, sin depender del workspace ni del padre:

- `app/assets/css/tailwind.css` es copia byte-exacta de `src/index.css`, con el **preflight activado** (el padre lo desactivó).
- Tema persistente en `localStorage.ccip-theme` y `?theme=light|dark`.
- Animaciones de entrada al scrollear con `IntersectionObserver` y hovers resaltados en `#f0cf00` (`--hover-highlight`).
- Formulario y newsletter simulados con `setTimeout(1100)`; no hacen `fetch` real.
- `src/`, `index.html`, `vite.config.ts` y `qa/baseline/` están congelados y excluidos de ESLint/Prettier.
- La comparación contra `qa/baseline/aprobado-index.html` es la referencia antes de mover cualquier pieza a `apps/web`.

El mapeo archivo por archivo y el orden de migración están en [`ANALISIS_Y_PLAN_DE_MIGRACION.md`](ANALISIS_Y_PLAN_DE_MIGRACION.md), sección 6.

## Contrato actual de la API

| Método | Ruta                               | Respuesta                                                        |
| ------ | ---------------------------------- | ---------------------------------------------------------------- |
| `GET`  | `/api/ubigeo/departamentos`        | `string[]`                                                       |
| `GET`  | `/api/ubigeo/provincias/:dep`      | `string[]`                                                       |
| `GET`  | `/api/ubigeo/distritos/:dep/:prov` | `string[]`                                                       |
| `POST` | `/api/contacto`                    | `{ success: true }` o `{ success: false, message }` (`HTTP 200`) |

El body de `POST /api/contacto` acepta: `tipo`, `nombres`, `apellidos`, `dni`, `telefono`, `email`, `empresa`, `mensaje`, `departamento`, `provincia` y `distrito`.

Se conserva el contrato histórico: errores de payload o de envío responden `HTTP 200` con `{ success: false, message: 'Error al enviar correo' }`.

El proxy `/api/**` existe en Nuxt porque el SSR resuelve `$fetch('/api/...')` contra el propio Nitro. Por defecto apunta a `http://localhost:3001`; en el VPS se define `NUXT_API_TARGET=http://api:3001` al compilar la web. Nginx además enruta el tráfico externo `/api` directamente al contenedor de la API.

## Configuración

Copia `.env.example` a `.env` y rellena los valores SMTP en el servidor. **No se ha movido al repo ninguna credencial antigua**: la app password expuesta en el historial debe rotarse en el proveedor de correo.

## Convenciones

- **Feature folders:** componentes y estilos de una misma responsabilidad viven juntos en `app/features/<feature>/`.
- **Componentes base:** `Base*` con slots/variants y a11y; el CSS de cada feature conserva la apariencia.
- **Estilos del padre:** Tailwind v4 sin preflight para utilidades nuevas; Sass (`.scss`) con variables en `app/styles/tokens.scss`; `tokens.css` conserva las custom properties en runtime. `experiment/` mantiene el preflight porque el diseño aprobado depende de él.
- **Backend:** controladores delgados → servicios → repositorios; la configuración se valida al arrancar.
- **Tipos:** contratos Zod en `packages/contracts`; sin `any` ni `@ts-ignore` en código nuevo.
- **Secretos:** solo en `.env` del servidor; `.env.example` contiene únicamente nombres y placeholders.
- **Estilo:** Prettier + ESLint compartidos; `.prettierignore` excluye `demo/` y `experiment/` por tener toolchains propias.
- **Checks antes de commitear:** `format:check`, `typecheck`, `lint`, `test` y `build`.

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

Se probó `typescript@7.0.2` de forma aislada y se descartó: `vue-tsc@3.3.14` intenta resolver `typescript/lib/tsc`, una subruta que TypeScript 7 ya no exporta (`ERR_PACKAGE_PATH_NOT_EXPORTED`). Se mantuvo `typescript@5.9.3` sin `any` ni `@ts-ignore`.

## Estado del plan

- Fases 0–10 del workspace y Etapa 1 de `experiment/` ejecutadas y verificadas.
- Checks verdes: `format:check`, `typecheck`, `lint`, `test` (17/17), `build`, `audit --audit-level moderate` y `docker compose config --quiet`.
- Demo sin errores de consola y con paridad visual contra `qa/baseline/` (solo difiere el canvas WebGL animado).
- Pendiente fuera del repo: dominio productivo, rotar la credencial expuesta en el historial y aprobación visual definitiva antes de mover piezas a `apps/web`.
- `demo/` no se tocó ni se incluye en el deploy.
