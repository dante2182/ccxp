# Pasos para completar y presentar el proyecto CCIP

Checklist operativo derivado de [`ANALISIS_Y_PLAN_DE_MIGRACION.md`](ANALISIS_Y_PLAN_DE_MIGRACION.md).  
Convención: `[x]` cerrado y verificado, `[ ]` pendiente o en evaluación. Para el detalle técnico de cada decisión, consulta el plan original.

## Fase 0 — Decisiones y seguridad inmediata

1. [x] Aprobar la arquitectura objetivo: `apps/web`, `apps/api`, `packages/contracts`, `packages/config`.
2. [ ] Rotar la app password de Gmail en el proveedor (fuera del repo; el historial no se reescribió).
3. [x] Confirmar Node 24 como runtime.
4. [ ] Confirmar modo de deploy: Docker Compose está listo; PM2 sigue en evaluación.
5. [x] Mantener Nginx + Let's Encrypt como proxy/TLS previsto.
6. [ ] Confirmar dominio productivo para `NUXT_PUBLIC_SITE_URL` y Nginx.
7. [x] Dejar `demo/` intacto y excluido del deploy.
8. [x] Decidir no reescribir el historial de Git.
9. [x] Conservar el contrato histórico `POST /api/contacto` → HTTP 200.

## Fase 1 — Línea base verde

1. [x] Tipar `ubigeo-peru.json` sin `any` ni `@ts-ignore`.
2. [x] Corregir errores de ESLint sin cambiar comportamiento.
3. [x] Excluir `demo/` del alcance de ESLint/Prettier.
4. [x] Añadir `.gitattributes` con `* text=auto eol=lf`.
5. [x] Normalizar saltos de línea y aplicar Prettier en una sola fase.
6. [x] Ajustar Prettier a `tabWidth: 2`.
7. [x] Corregir `.vscode/launch.json` a `3000`.

## Fase 2 — Skeleton del monorepo

1. [x] Declarar `apps/*` y `packages/*` en `pnpm-workspace.yaml`.
2. [x] Crear `package.json` root con scripts `dev`, `build`, `typecheck`, `lint`, `format`, `format:check`.
3. [x] Crear `tsconfig.base.json` con `strict`, `noEmit` y `moduleResolution: Bundler`.
4. [x] Crear `packages/config` y `packages/contracts` instalables.
5. [x] Mover el proyecto Nuxt a `apps/web` con `git mv`.
6. [x] Conservar los alias `@/` y `~/`.
7. [x] Verificar build y las rutas `/`, `/proyectos`, `/proyectos/1`, `/servicios/<slug>`.

## Fase 3 — Extracción de la API

1. [x] Crear `apps/api` con Nitro y `package.json` propio.
2. [x] Mover los handlers a la estructura por dominio.
3. [x] Mover `ubigeo-peru.json` a `apps/api/src/modules/ubigeo/data/`.
4. [x] Mover la configuración SMTP a variables de entorno.
5. [x] Configurar el proxy `/api/**` a `http://localhost:3001`.
6. [x] Documentar el contrato público de las rutas API.

## Fase 4 — Contratos compartidos y configuración

1. [x] Crear esquemas Zod en `packages/contracts`.
2. [x] Reexportar los tipos desde los contratos compartidos.
3. [x] Usar los esquemas en los controllers de contacto y ubigeo.
4. [x] Centralizar ESLint, Prettier y tsconfig en `packages/config`.

## Fase 5 — Dependencias por grupos

1. [x] 5a tooling: pnpm `12.23.0`, ESLint `10.16.0`, `eslint-config-prettier` `10.1.9`, `@types/node` y lockfile.
2. [x] 5b framework: Nuxt `4.7.0` con Nitro/Vite compatibles; SSR y rutas verificados.
3. [x] 5c TypeScript: mantener `5.9.3`; `7.0.2` probado y descartado por `vue-tsc`.
4. [x] 5d auditoría: override `minimatch@11.0.1` y `pnpm audit` en cero.

## Fase 6 — Backend SOLID y operabilidad

1. [x] Crear `config/env.ts` con validación Zod al arrancar.
2. [x] Crear la interfaz `MailSender` y `SmtpMailSender`.
3. [x] Crear `ContactService` con validación, escape y composición del correo.
4. [x] Crear `UbigeoRepository` y `JsonUbigeoRepository`.
5. [x] Convertir los controllers en capas delgadas con DI.
6. [x] Añadir `escape-html.ts` y usarlo en el correo.
7. [x] Añadir `/health` con `{ status, uptime, version }`.
8. [x] Añadir `pino` + `pino-http` con request-id, sin loguear el body.
9. [x] Añadir manejo de errores centralizado y graceful shutdown.
10. [x] Añadir tests Vitest de contacto y ubigeo con fakes.

## Fase 7 — Secretos, CORS y proxy

1. [x] Eliminar configuración sensible del árbol versionado.
2. [x] Crear `.env.example` solo con nombres y placeholders.
3. [x] Verificar `.gitignore` para `.env` y `.env.*`.
4. [x] Configurar Nginx con `/api` → API y `/` → web.
5. [x] Configurar CORS de mismo origen, sin `*`.
6. [x] Generar `sitemap.xml` y `robots.txt` en runtime desde `NUXT_PUBLIC_SITE_URL`.
7. [ ] Completar el dominio real en Nginx; rotar la credencial expuesta en el historial.

## Fase 8 — Componentización y migración visual

1. [x] Crear los componentes base con slots, variants y a11y.
2. [x] Migrar el formulario de contacto a componentes por feature.
3. [x] Renombrar header/footer a `SiteHeader.vue` / `SiteFooter.vue`.
4. [x] Migrar tarjetas y extraer tokens de estilo.
5. [x] Verificar capturediffs de las rutas legacy.
6. [x] Traducir el demo aprobado a `experiment/` con Nuxt 4.
7. [x] Step 2: extraer composables y reconectar header/hero/planeta.
8. [x] Step 3: mover contenido a JSON canónico y endpoints Nitro locales.
9. [x] Step 4: añadir `/api/v1/**` con códigos HTTP semánticos y `Problem+JSON`.
10. [x] Añadir “Ver más” → `/blog`, nuevo `qa/baseline-v2/` y `qa/comparison.html`.
11. [ ] Mover las piezas de `experiment/` a `apps/web` cuando se apruebe el corte definitivo (hoy `apps/web` sigue como legacy).

## Step 5 SEO / cierre parcial

1. [x] `sitemap.xml` dinámico generado desde proyectos y servicios reales.
2. [x] `robots.txt` dinámico con `Disallow: /api/`.
3. [x] Canonical y `og:url` por ruta desde `NUXT_PUBLIC_SITE_URL`.
4. [x] Eliminar los archivos estáticos duplicados.
5. [x] Smoke de dominio inyectado por entorno y documentación actualizada.
6. [ ] Aplicar el dominio real en producción.

## Fase 9 — VPS y deployment

1. [x] Dockerfile multi-stage para `apps/web`.
2. [x] Dockerfile multi-stage para `apps/api`.
3. [x] Usuarios no root, `NODE_ENV=production` y pnpm en la etapa de build.
4. [x] `deploy/docker-compose.yml` con `web`, `api` y `nginx`.
5. [x] `deploy/nginx/ccip.conf` con TLS, `/api`, caché y rate limit.
6. [x] Healthchecks de Compose contra `/health` y `/`.
7. [ ] Probar `docker compose up -d` y smoke HTTPS en el VPS (Docker sigue en evaluación).
8. [ ] Documentar/ejecutar el update final; si se elige PM2, crear su runbook equivalente.

## Fase 10 — Cierre y documentación

1. [x] README con requisitos, scripts, arquitectura, convenciones, deploy y rollback.
2. [x] Decidir destino de `demo/`: intacto y excluido.
3. [ ] Optimización opcional de assets: solo con aprobación explícita.
4. [x] Verificación final: `format:check`, `typecheck`, `lint`, `test`, `build`, `audit`, `docker compose config --quiet`.

## Presentación final

1. [ ] Configurar `.env` real con SMTP y `NUXT_PUBLIC_SITE_URL=https://<dominio>`.
2. [ ] Reemplazar `tu-dominio.com` en `deploy/nginx/ccip.conf` y en los comandos de certbot.
3. [ ] Rotar la app password en el proveedor de correo.
4. [ ] Definir Docker Compose o PM2 como modo de deploy definitivo.
5. [ ] Ejecutar la batería completa de checks y el smoke de las rutas públicas.
6. [ ] Verificar `/sitemap.xml`, `/robots.txt`, canonical y `og:url` con el dominio real.
7. [ ] Abrir `experiment/qa/comparison.html` y obtener la aprobación visual definitiva.
8. [ ] Si aplica, levantar servicios con `pnpm deploy:up` y ejecutar los `curl` de `deploy/README.md`.
9. [ ] Crear el tag de entrega, por ejemplo `git tag -a v1.0.0 -m "Entrega CCIP"` y `git push --tags`.
10. [ ] Presentar: README, este documento, `deploy/README.md`, la comparación visual y el smoke test.
