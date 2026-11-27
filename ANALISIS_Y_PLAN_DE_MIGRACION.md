# Auditoría, plan de modernización y arquitectura objetivo — CCIP

> **Fecha del análisis:** 2026-11-27  
> **Estado:** plan ejecutado por fases 0–10 el 2026-11-27; Etapa 1 de `experiment/` (demo visual → Nuxt 4) cerrada el 2026-11-27; Steps 2–4 y Step 5 SEO cerrados el 2026-11-27. Verificación automatizada en verde; historial de Git **no** reescrito. Docker/PM2 queda en evaluación.
> **Uso:** este archivo es la fuente de verdad para aprobar y ejecutar la migración por fases.

---

## 0. Estado de ejecución (2026-11-27)

- **Fases 0–8 aplicadas:** workspace pnpm, apps `api`/`web`, contratos Zod, dependencias actualizadas, backend SOLID con health/CORS/logs/shutdown, secretos fuera del repo y UI componentizada.
- **Fase 9 aplicada:** Dockerfiles multi-stage no root, `deploy/docker-compose.yml` con healthchecks, límites de memoria, Nginx TLS con `/api` y runbook en `deploy/README.md`.
- **Fase 10 aplicada:** README final con requisitos, scripts, arquitectura, convenciones, deploy y rollback; `demo/` intacto y excluido del contexto Docker.
- **Stack de estilos:** Tailwind v4 (`@tailwindcss/vite`, sin preflight) y Sass (`sass`, archivos `.scss`, tokens en `styles/tokens.scss`); migración visual verificada sin cambios de maquetación.
- **Verificación verde:** `pnpm format:check`, `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`, `pnpm audit --audit-level moderate` y `docker compose config`.
- **Smoke test:** `/`, `/proyectos`, `/proyectos/1`, `/servicios/redes-telematica`, `/api/ubigeo/departamentos` y `/health` responden 200; `POST /api/contacto` conserva el contrato de error HTTP 200.
- **Comparación visual:** `/proyectos`, `/proyectos/1` y `/servicios/redes-telematica` son idénticos píxel a píxel. En `/` las dimensiones y estructura coinciden; las diferencias localizadas corresponden al video en autoplay y a las marcas animadas, no a cambios de maquetación.
- **Step 5 SEO aplicado:** `sitemap.xml` y `robots.txt` se generan en runtime desde `NUXT_PUBLIC_SITE_URL`, con las mismas URLs canónicas y `og:url` de cada ruta.
- **Pendiente externo:** confirmar dominio productivo en `NUXT_PUBLIC_SITE_URL` y Nginx; rotar la credencial expuesta en el historial. Docker/PM2 sigue en evaluación. La optimización opcional de assets no se aplicó (requiere aprobación).

---

## 1. Estado actual: qué hay, qué está mal y qué está bien

### 1.1 Inventario real del repositorio

```text
ccxp/
├── .data/                              # Estado local de Nuxt (kv), ignorado
├── .nuxt/                              # Tipos generados por Nuxt, ignorado
├── .vscode/
│   ├── launch.json                     # Config de depuración (apunta a puerto 8080)
│   └── settings.json                   # Prettier + ESLint + files.eol = \n
├── app/                                # Frontend + datos + tipos (todo mezclado)
│   ├── app.vue                         # Root: <NuxtPage> + estilos globales + Font Awesome CDN
│   ├── assets/
│   │   ├── css/
│   │   │   ├── main.css                # Fuentes Qanelas + reset
│   │   │   ├── components/             # 12 CSS por componente (~48 KB)
│   │   │   └── pages/IndexSection.css
│   │   └── fonts/qanelas/*.woff2       # 4 fuentes auto-hospedadas
│   ├── components/                     # 9 componentes Vue + .gitkeep
│   │   ├── AboutSection.vue
│   │   ├── ContactSection.vue          # ~10 KB, formulario completo en un solo archivo
│   │   ├── Footer.vue
│   │   ├── Header.vue
│   │   ├── PartnersSection.vue
│   │   ├── ProjectsSection.vue
│   │   ├── ServicesSection.vue
│   │   └── TeamSection.vue
│   ├── composables/                    # 9 archivos: estado UI + acceso a datos + repos
│   │   ├── useCarousel.ts
│   │   ├── useCompanySocial.ts
│   │   ├── useContact.ts
│   │   ├── useContactForm.ts           # ~7 KB, validación + fetch + WhatsApp
│   │   ├── useHeaderScroll.ts          # ~5 KB, scroll/RAF/navegación
│   │   ├── usePartners.ts
│   │   ├── useProjects.ts              # getAllProjects / getProjectById desde JSON
│   │   ├── useServices.ts              # getAllServices / getServiceBySlug desde JSON
│   │   └── useTeam.ts
│   ├── data/                           # JSON de contenido + configuración sensible
│   │   ├── company-social.json
│   │   ├── contact-config.json         # ⚠ SMTP y app password de Gmail en repo
│   │   ├── contact.json
│   │   ├── partners.json
│   │   ├── projects.json
│   │   ├── services.json
│   │   ├── team.json
│   │   └── ubigeo-peru.json
│   ├── pages/
│   │   ├── index.vue
│   │   ├── proyectos/index.vue
│   │   ├── proyectos/[id].vue
│   │   └── servicios/[slug].vue
│   └── types/                          # 7 archivos de tipos que espejan los JSON
├── public/
│   ├── images/                         # ~50 imágenes (webp + jpg/jpeg duplicados)
│   ├── videos/hero2.mp4                # ~11 MB
│   ├── robots.txt                      # Sitemap apunta a Vercel
│   └── sitemap.xml                     # URLs hardcodeadas a ccip-page-nuxt.vercel.app
├── server/                             # Backend acoplado al frontend
│   └── api/
│       ├── contacto.post.ts            # Nodemailer + HTML armado con template string
│       └── ubigeo/
│           ├── departamentos.ts
│           ├── provincias/[dep].ts
│           └── distritos/[dep]/[prov].ts
├── demo/                               # ⚠ No trackeado. Prototipo React/Vite aparte
│   ├── package.json + package-lock.json
│   ├── index.html + vite.config.ts + tsconfig.json
│   ├── src/ (App.tsx, 13 componentes, ui.tsx, data.ts)
│   ├── dist/index.html                 # ~1 MB single-file build
│   └── qa/                             # ~20 KB–800 KB de capturas (.png) + scripts .mjs
├── .gitignore                          # Ignora .env, .nuxt, .output, node_modules, etc.
├── .prettierignore
├── .prettierrc                         # semi:false, tabWidth:4, singleQuote, endOfLine:lf
├── eslint.config.mjs                   # withNuxt(...) + prettier; no ignora demo/
├── nuxt.config.ts                      # srcDir: 'app', compat date, CSS global, Nitro
├── package.json                        # pnpm@12.15.0, Node >=24, Nuxt 4.6.4, TS 5.9.3
├── pnpm-lock.yaml                      # ⚠ Modificado en 1 línea en el working tree
├── pnpm-workspace.yaml                 # ⚠ Sin campo `packages:`; solo ajustes de pnpm
├── README.md                           # Guía corta de inicio Nuxt
└── tsconfig.json                       # Referencias a .nuxt/tsconfig.*.json
```

#### 1.1.1 Estado del working tree (no tocado)

| Elemento         | Situación                                                                                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `pnpm-lock.yaml` | Modificado por el usuario: el specifier de `@types/node` pasó de `^24.19.2` a `24.19.2`. Se respetará esta intención al actualizar dependencias. |
| `demo/`          | Sin trackear. No forma parte del workspace de pnpm, pero **sí** es lintada por `eslint .`.                                                       |

#### 1.1.2 Verificación base ejecutada

| Comando             | Resultado  | Detalle                                                                                                                                                |
| ------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `node -v`           | `v24.22.1` | Compatible con Nuxt 4.7.0.                                                                                                                             |
| `pnpm -v`           | `12.15.0`  | Latest estable: `12.23.0`.                                                                                                                             |
| `pnpm build`        | ✅ OK      | Nuxt 4.6.4 + Nitro 2.13.6 + Vite 8.3.8. Output `node-server`, 4.29 MB / 1.07 MB gzip. Warnings no bloqueantes de SSR styles y un comentario de Rollup. |
| `pnpm typecheck`    | ❌ FAIL    | 4 errores TS7053 duplicados por project references en `ubigeo/provincias/[dep].ts` y `ubigeo/distritos/[dep]/[prov].ts`.                               |
| `pnpm lint`         | ❌ FAIL    | 14 errores, 27 warnings. 4 errores vienen de `demo/`.                                                                                                  |
| `pnpm format:check` | ❌ FAIL    | 88 archivos. Causa principal: CRLF en disco vs `endOfLine: "lf"`.                                                                                      |
| `pnpm audit`        | ❌ FAIL    | 1 vulnerabilidad moderada transitiva (`minimatch`).                                                                                                    |
| Tests               | —          | **No existe ningún archivo `*.test.*` / `*.spec.*` en el repo.**                                                                                       |

---

### 1.2 Cosas decentes que deben conservarse

Aunque el planteamiento general necesita trabajo, hay bases útiles:

1. **pnpm ya está adoptado** con `packageManager` fijado y lockfile version 9.
2. **Nuxt 4 + TypeScript + Vue 3.5** ya están instalados; no hay que migrar de framework completo.
3. **Versiones exactas** en `package.json` (`saveExact: true` en `pnpm-workspace.yaml`): ayuda a la reproducibilidad.
4. **Nitro ya compila a preset `node-server`**, ideal para VPS.
5. **SSR + `useSeoMeta()`** ya están presentes en las páginas: se debe conservar para no perder SEO.
6. **Existen `robots.txt` y `sitemap.xml`**; solo necesitan apuntar al dominio real.
7. **Fuentes Qanelas auto-hospedadas** con `font-display: swap`: buena decisión, sin dependencia externa de Google Fonts.
8. **Parte de las imágenes ya están en WebP**, lo cual reduce peso.
9. **ESLint flat config + Prettier + `vue-tsc`** ya configurados; el problema es de estado, no de ausencia de herramientas.
10. **Contenido en JSON simple**: para este proyecto (sin base de datos) es una opción válida y muy barata en VPS.
11. **`pnpm-workspace.yaml` ya tiene `allowBuilds` y `minimumReleaseAgeExclude`**: solo falta declarar los paquetes del monorepo.
12. **La lógica de negocio es pequeña**: hacer la refactorización ahora es mucho más barato que más adelante.

---

### 1.3 Todo lo que está mal (problemas encontrados)

#### A. Seguridad — prioridad crítica

| #   | Problema                                                           | Ubicación                                                            | Impacto                                                                                                                                                |
| --- | ------------------------------------------------------------------ | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A1  | **Credencial SMTP real (Gmail + app password) committed.**         | `app/data/contact-config.json`, presente en historial Git.           | Cualquier persona con acceso al repo puede enviar correo suplantando al formulario. Debe rotarse **ya**, incluso antes de migrar.                      |
| A2  | Configuración de servidor dentro de `app/` (carpeta del frontend). | `app/data/contact-config.json`, `app/types/contact-config.types.ts`. | Riesgo de importación accidental en bundle cliente. Hoy solo la usa `server/api`, pero la ubicación es peligrosa.                                      |
| A3  | Sin `.env.example` ni validación de variables al arrancar.         | Raíz del repo.                                                       | En VPS faltan variables → error en runtime, no en deploy.                                                                                              |
| A4  | Interpolación directa de `body.*` en HTML del correo.              | `server/api/contacto.post.ts:25-40`.                                 | Inyección de HTML en el mensaje; además no hay escape de caracteres.                                                                                   |
| A5  | Validación solo en cliente.                                        | `app/composables/useContactForm.ts`.                                 | Un atacante puede llamar `POST /api/contacto` directamente con cualquier payload.                                                                      |
| A6  | `v-html` con descripciones de servicios.                           | `app/pages/servicios/[slug].vue:27`.                                 | XSS si el JSON de contenido se vuelve editable en el futuro.                                                                                           |
| A7  | Sin rate limiting en `/api/contacto`.                              | Falta en Nginx/Nitro.                                                | Spam de correo y WhatsApp.                                                                                                                             |
| A8  | Errores devueltos con HTTP 200 (`{ success: false }`).             | `server/api/contacto.post.ts:51-54`.                                 | Monitoreo y clientes no pueden detectar fallos por código de estado. **Cambiar esto requiere aprobación explícita** porque altera contrato observable. |
| A9  | `console.error` sin logging estructural.                           | `contacto.post.ts`, composables.                                     | Sin request-id, sin niveles, sin correlación en VPS.                                                                                                   |

#### B. Arquitectura y acoplamiento

| #   | Problema                                   | Detalle                                                                                                                         |
| --- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| B1  | Backend importa datos del frontend.        | `server/api/ubigeo/*.ts` y `contacto.post.ts` usan `~/data/*.json` desde `app/`. Imposible desplegar API sin el source del web. |
| B2  | No hay separación `apps/api` / `apps/web`. | Todo vive en un único proyecto Nuxt. El workspace de pnpm está declarado a medias.                                              |
| B3  | "Composables" que no son composables.      | `useProjects.ts`, `useServices.ts`, `useCompanySocial.ts`, etc. son funciones de acceso a datos/repository sin reactividad.     |
| B4  | Tipos duplicados manualmente.              | `app/types/*.types.ts` espejan la forma de `app/data/*.json` sin validación runtime ni fuente única.                            |
| B5  | Sin capa de servicios/repository/DI.       | Los handlers hacen todo: HTTP, construcción del correo, transporte, acceso a datos.                                             |
| B6  | Sin interfaces/abstracciones.              | `as any` en `contacto.post.ts:22` para el transporter; `navigate(section: any)` en `Header.vue:76`.                             |
| B7  | Sin Health check ni graceful shutdown.     | No hay `/health`, ni manejo de `SIGTERM`, ni drenaje de conexiones.                                                             |
| B8  | Sin CORS deliberado.                       | Hoy funciona por same-origin; al separar apps hay que decidirlo explícitamente.                                                 |

#### C. Frontend y UI

| #   | Problema                                            | Detalle                                                                                                                                                        |
| --- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C1  | No hay componentes base reutilizables.              | Inputs, selects, botones y mensajes de error están repetidos a mano en `ContactSection.vue`.                                                                   |
| C2  | `ContactSection.vue` demasiado grande.              | ~10 KB con 8 campos, validación visual, mapa, WhatsApp y estilos. Difícil de testear.                                                                          |
| C3  | CSS organizado por tipo de archivo, no por feature. | 12 archivos en `assets/css/components/`; `servicios/[slug].vue` tiene ~135 líneas de CSS inline.                                                               |
| C4  | `v-html` sin saneamiento (ver A6).                  | Riesgo y además rompe el principio de componentes seguros por defecto.                                                                                         |
| C5  | Template con múltiples raíces.                      | `proyectos/[id].vue:114` y `servicios/[slug].vue:43` → error ESLint `vue/no-multiple-template-root`.                                                           |
| C6  | Nombres de componentes de una palabra.              | `Header.vue`, `Footer.vue` → error `vue/multi-word-component-names`.                                                                                           |
| C7  | Accesibilidad incompleta.                           | `<div class="scroll-indicator" @click>` sin rol/teclado; botones de nav sin `aria-current`; iconos Font Awesome por CDN.                                       |
| C8  | CDN externo.                                        | `app.vue:53-66` carga Font Awesome 6.5.1 desde cdnjs: dependencia de red en producción ya teniendo assets locales.                                             |
| C9  | Navegación dudosa preservada.                       | En `proyectos/[id].vue`, `goToContact()` llama a `goToSection('contact')`, pero esa página no tiene `#contact`. Se documenta; **no se cambia sin aprobación**. |

#### D. Calidad de código, lint y formato

| #   | Problema                                                                     | Detalle                                                                                                                                                 |
| --- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | Typecheck roto.                                                              | TS7053 por indexar JSON con `string` sin tipo índice. Las líneas se repiten por `tsconfig.json` references app/server.                                  |
| D2  | Lint con 14 errores.                                                         | `no-unused-vars` (`validarFormulario`, `goToSlide`), `any`, `no-dynamic-delete`, multi-root, nombres de componentes, imports fuera de orden en `demo/`. |
| D3  | 27 warnings.                                                                 | `vue/attributes-order`, `vue/block-order`, `vue/no-v-html`.                                                                                             |
| D4  | `format:check` falla en 88 archivos.                                         | `.prettierrc` exige LF pero los archivos están CRLF; además falta `.gitattributes`.                                                                     |
| D5  | `eslint .` incluye `demo/`.                                                  | Genera 4 errores de un proyecto que no es parte del producto.                                                                                           |
| D6  | `pnpm format` usa `tabWidth: 4` pero el código está mayormente a 2 espacios. | Ruido masivo de diff al formatear.                                                                                                                      |
| D7  | No hay tests.                                                                | Sin Vitest ni tests de servicios/repository/componentes.                                                                                                |
| D8  | `launch.json` apunta a `http://localhost:8080`.                              | El dev server real está en `3000`; depuración rota.                                                                                                     |

#### E. Dependencias y vulnerabilidades

| Paquete                  |  Actual |               Latest estable | Acción propuesta                                                                                                    |
| ------------------------ | ------: | ---------------------------: | ------------------------------------------------------------------------------------------------------------------- |
| `pnpm` (packageManager)  | 12.15.0 |                      12.23.0 | Actualizar en fase de tooling.                                                                                      |
| `nuxt`                   |   4.6.4 |                        4.7.0 | Actualizar en grupo propio. Requiere Node `^22.22.3 \|\| ^24.15.0 \|\| >=26`.                                       |
| `typescript`             |   5.9.3 |                        7.0.2 | 5.9.3 es el último 5.x. TS 7.0.2 es stable pero **major compiler**; validar aparte antes de adoptar.                |
| `@types/node`            | 24.19.2 | 24.19.4 (línea 24) / 26.6.11 | Alinear con Node del VPS, no “el más alto”.                                                                         |
| `eslint`                 | 10.15.0 |                      10.16.0 | Update de tooling.                                                                                                  |
| `@nuxt/eslint`           |  1.17.0 |                       1.17.0 | Ya current.                                                                                                         |
| `eslint-config-prettier` |  10.1.8 |                       10.1.9 | Update de tooling.                                                                                                  |
| `prettier`               |  3.10.1 |                       3.10.1 | Ya current.                                                                                                         |
| `vue-tsc`                |  3.3.14 |                       3.3.14 | Ya current. Declara peer `typescript >=5.0.0`.                                                                      |
| `nodemailer`             |  10.6.1 |                       10.6.1 | Ya current y mantenido.                                                                                             |
| `@types/nodemailer`      |   8.0.2 |                        8.0.2 | No hay 8.x más nuevo. Probablemente necesario porque `exports` de nodemailer no expone `types`. Reevaluar con TS 7. |

**Vulnerabilidad auditada:**

```text
moderate  minimatch >=7.0.0 <11.0.1  (GHSA-g3hv-75wg-m249)
ruta: . > nuxt > @nuxt/nitro-server > nitropack > archiver > readdir-glob > minimatch
fix:    minimatch >=11.0.1  (via pnpm.overrides, probando compatibilidad con readdir-glob)
```

Es ruta de build/zip, no un endpoint público, pero se debe corregir.

**No se encontraron dependencias_directas deprecated, alpha, beta ni rc.** Sí hay elementos innecesarios para producción: `demo/` con `package-lock.json`, `dist/` generado y ~20 MB de capturas QA.

#### F. VPS y operaciones

| #   | Problema                                       | Detalle                                                                 |
| --- | ---------------------------------------------- | ----------------------------------------------------------------------- |
| F1  | Sin Dockerfile / docker-compose / config PM2.  | No hay forma reproducible de desplegar.                                 |
| F2  | Sin Nginx/Caddy.                               | No hay TLS, ni compresión de assets, niproxy `/api`.                    |
| F3  | `sitemap.xml` y `robots.txt` apuntan a Vercel. | SEO apuntando al host equivocado.                                       |
| F4  | Sin health check.                              | Compose/PM2 no puede saber si el servicio está vivo.                    |
| F5  | Sin logging estructural.                       | Difícil operar en VPS con poco RAM/CPU.                                 |
| F6  | Video hero de ~11 MB servido desde `/public`.  | Consume ancho de banda; requiere `range` y caché correctos en el proxy. |
| F7  | Sin límites de recursos documentados.          | Riesgo de OOM en VPS pequeño.                                           |
| F8  | Sin guía de deploy ni de actualización.        | README solo cubre `pnpm dev/build`.                                     |

#### G. Datos y assets

- Duplicados `.jpg` / `.jpeg` y `.webp` de las mismas fotos en `public/images/projects/` y `public/images/services/`.
- `app/data/ubigeo-peru.json` solo cubre 6 departamentos; está bien para el comportamiento actual, pero debe quedar detrás de un repository para poder crecer sin tocar handlers.
- `public/sitemap.xml` lista proyectos con IDs fijos (1–4, etc.); al mover contenido a otro origen habrá que generarlo, pero **no en esta migración**.

---

## 2. Cambios propuestos y por qué

| Cambio                                                       | Por qué                                                                                                                  | Riesgo / condición                                                                                                 |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| Rotar la app password de Gmail y sacar credenciales del repo | Es un secreto real ya expuesto en historial (A1).                                                                        | Acción inmediata, previa a cualquier deploy. La limpieza de historial se decide aparte (reescritura + force push). |
| Crear monorepo pnpm con `apps/api`, `apps/web`, `packages/*` | Permite desplegar/operar backend y frontend por separado y evita que `server/` importe `app/` (B1, B2).                  | Se hará con movidos de archivo y sin cambiar rutas públicas.                                                       |
| Mantener Nuxt en `apps/web` con SSR                          | Preserva SEO y `useSeoMeta()` actuales. Convertir a SPA cambiaría comportamiento visible; no se hará sin aprobación.     | —                                                                                                                  |
| Extraer API a Nitro standalone en `apps/api`                 | Mismo runtime que ya usa el proyecto, curva de aprendizaje mínima (B5, F1).                                              | Compatibilidad Nuxt 4.7 / Nitro a verificar en fase de dependencias.                                               |
| Nginx con `/api` → API y `/` → web                           | Evita CORS en el navegador y mantiene las URLs actuales `/api/...`.                                                      | Si se necesita otro dominio para la API, se usará allow-list por env, nunca `*`.                                   |
| Capas controller → service → repository + DI                 | Aplica SRP/DIP/OCP: controllers delgados, lógica en servicios, datos en repositories (B5, B6).                           | Sin cambios de respuesta; se refactoriza internamente.                                                             |
| Interfaces `MailSender` / `UbigeoRepository`                 | Permite cambiar SMTP por otro proveedor o JSON por DB sin tocar casos de uso.                                            | Implementación inicial seguirá siendo Nodemailer + JSON.                                                           |
| Zod en `packages/contracts`                                  | Única fuente de tipos + validación runtime tanto en web como en API (B4, A5).                                            | Los esquemas reflejan exactamente el formulario actual.                                                            |
| Validación de env al arrancar                                | Fallo rápido en VPS si falta SMTP/NODE_ENV (A3).                                                                         | `.env.example` sin valores reales.                                                                                 |
| Escapar HTML del correo                                      | Elimina inyección sin cambiar el contenido visible del email (A4).                                                       | Se testea con un payload con `<script>`.                                                                           |
| Logging `pino` + `/health` + `SIGTERM`                       | Requisitos de VPS: observabilidad, healthcheck y shutdown limpio (A9, F5, F2).                                           | Logs sin PII (no body completo).                                                                                   |
| Rate limit en Nginx para `/api/contacto`                     | Anti-spam sin añadir dependencias ni cambiar el formulario (A7).                                                         | Ajustable por env.                                                                                                 |
| Componentes base `BaseButton/Input/Select/Modal/Card`        | Comparten estructura, comportamiento y accesibilidad; el diseño se personaliza por variants/slots (C1, C2).              | Migración page-by-page con comparación visual.                                                                     |
| Design tokens + CSS por feature                              | Reduce duplicación y hace escalable el styling (C3).                                                                     | Sin cambios de colores/tipografía.                                                                                 |
| Corregir typecheck/lint/format antes de mover código         | Necesitamos una línea base verde para atribuir cualquier regresión a una fase concreta (D1–D8).                          | El formateo masivo se hará en su propia fase para no mezclar diffs.                                                |
| `.gitattributes` + normalización LF                          | Evita que `format:check` vuelva a romperse por CRLF (D4).                                                                | Convertir archivos a LF una sola vez.                                                                              |
| Dependencias por grupos                                      | Si algo rompe, se sabe qué actualización lo causó (E).                                                                   | Orden: tooling → framework → TypeScript → override de auditoría.                                                   |
| TypeScript 5.9.3 por ahora; evaluar 7.0.2 aparte             | Es el último 5.x y el que ya usa `vue-tsc@3.3.14`. TS 7 es major y debe validarse con Nuxt/Nitro antes de adoptarlo (E). | No se usará `any`/`@ts-ignore` para silenciar.                                                                     |
| Vitest para servicios y esquemas                             | Hoy no hay tests (D7). Empieza por lo barato: contact service, ubigeo service, env validation.                           | —                                                                                                                  |
| Docker Compose + Nginx + guía de deploy                      | Requisito VPS (F1, F2, F6, F7, F8).                                                                                      | Alternativa PM2 si se confirma que no se quiere Docker.                                                            |
| Excluir o aislar `demo/`                                     | No es producto y ensucia lint/format (D5, E).                                                                            | Requiere decisión del usuario.                                                                                     |
| No tocar imágenes/video ni lógica de negocio todavía         | Regla de “no cambiar comportamiento visible sin aprobación”.                                                             | Optimización de assets queda como fase opcional final.                                                             |

---

## 3. Proyecto esperado: arquitectura objetivo, dependencias y estructura

### 3.1 Principios rectores

1. **Un solo monorepo pnpm**, con apps desplegables por separado.
2. **Backend por dominio**, no por tipo de archivo: `contact`, `ubigeo`, `health`.
3. **Frontend por feature**, con un conjunto pequeño de componentes base reutilizables.
4. **Contratos compartidos** con Zod: validación runtime + tipos inferidos.
5. **Dependency injection explícita** mediante composition roots (`index.ts` por módulo).
6. **Sin secretos en el repo**: `.env` local, `.env.example` committed, validación al arrancar.
7. **Misma URL pública** para la API (`/api/...`) gracias al reverse proxy.
8. **Strict mode progresivo**: estricto en paquetes nuevos; correcciones reales en código existente.
9. **Producción en VPS con pocos recursos**: multi-stage builds, usuario no root, límites de memoria, logs JSON.

### 3.2 Stack y dependencias objetivo

#### Root

| Dependencia              |                          Versión objetivo | Uso                               |
| ------------------------ | ----------------------------------------: | --------------------------------- |
| `pnpm` (packageManager)  |                                 `12.23.0` | Gestor de paquetes único.         |
| Node.js                  |           `>=24.15.0 <25` (confirmar VPS) | Runtime alineado con Nuxt 4.7.    |
| `typescript`             | `5.9.3` (evaluar `7.0.2` en fase aislada) | Compilador.                       |
| `eslint`                 |                                 `10.16.0` | Lint.                             |
| `@nuxt/eslint`           |                                  `1.17.0` | Config de ESLint para Nuxt.       |
| `eslint-config-prettier` |                                  `10.1.9` | Evita conflictos ESLint/Prettier. |
| `prettier`               |                                  `3.10.1` | Formato (LF, 2 espacios).         |
| `vue-tsc`                |                                  `3.3.14` | Typecheck de SFC.                 |
| `@types/node`            |                                 `24.19.4` | Tipos Node alineados al runtime.  |

#### `apps/web`

| Dependencia          |          Versión objetivo | Uso                          |
| -------------------- | ------------------------: | ---------------------------- |
| `nuxt`               |                   `4.7.0` | SSR, routing, SEO.           |
| `vue` / `vue-router` | las que traiga Nuxt 4.7.0 | No instalar por separado.    |
| `@ccxp/contracts`    |             `workspace:*` | Tipos/esquemas compartidos.  |
| `@ccxp/config`       |             `workspace:*` | Config TS/ESLint compartida. |

> No se añaden librerías de UI. Los componentes base se implementan con Vue + CSS propio para no cambiar el diseño actual.

#### `apps/api`

| Dependencia         | Versión objetivo | Uso                                                          |
| ------------------- | ---------------: | ------------------------------------------------------------ |
| `nitropack`         |         `2.14.0` | Servidor HTTP standalone (mismo ecosistema que ya usa Nuxt). |
| `nodemailer`        |         `10.6.1` | Transporte SMTP (se mantiene).                               |
| `@types/nodemailer` |          `8.0.2` | Tipos, si siguen siendo necesarios tras validar resolución.  |
| `zod`               |          `4.6.7` | Validación de request y env.                                 |
| `@t3-oss/env-core`  |        `0.13.11` | Validación tipada de variables de entorno.                   |
| `pino`              |         `10.4.0` | Logging estructural.                                         |
| `pino-http`         |         `11.0.0` | Logging de requests con request-id.                          |
| `@ccxp/contracts`   |    `workspace:*` | Contratos compartidos.                                       |
| `@ccxp/config`      |    `workspace:*` | Config compartida.                                           |
| `vitest`            |          `5.1.2` | Tests de servicios/esquemas (devDependency).                 |

#### `packages/contracts`

| Dependencia | Versión | Uso                                         |
| ----------- | ------: | ------------------------------------------- |
| `zod`       | `4.6.7` | Única fuente de esquemas y tipos inferidos. |

#### `packages/config`

Sin dependencias de runtime; solo `tsconfig.base.json`, presets de ESLint/Prettier y helpers de env.

#### `deploy`

Nginx (o Caddy si se confirma) + Docker Engine + Compose en el VPS. Sin dependencias npm.

#### Notas de compatibilidad

- Nuxt 4.7.0 declara `node: ^22.22.3 || ^24.15.0 || >=26.0.0` y peers `rolldown ~1.2.1`, `@types/node >=18.12.0`, `@parcel/watcher ^2.1.0`. Con Node 24.22.1 y `@types/node@24.19.4` hay compatibilidad.
- `@t3-oss/env-core@0.13.11` acepta `zod ^3.24.0 || ^4.0.0` y `typescript >=5.0.0`.
- `vitest@5.1.2` acepta Vite `^6.4.0 || ^7.0.0 || ^8.0.0` y Node `^22.12.0 || ^24.0.0 || >=26.0.0`.
- `@nuxt/eslint@1.17.0` acepta ESLint `^9 || ^10`.
- La corrección de `minimatch` se hará con `pnpm.overrides`, verificando `pnpm build` después.

### 3.3 Backend objetivo — flujo y responsabilidades

```text
POST /api/contacto
  └─ controller.ts        → parsea con ContactRequestSchema (Zod)
       └─ service.ts      → caso de uso: validar negocio, escapar HTML, armar mensaje
            └─ MailSender (interfaz)
                 └─ SmtpMailSender (Nodemailer)  ← inyectado en index.ts

GET /api/ubigeo/departamentos | /provincias/:dep | /distritos/:dep/:prov
  └─ controller.ts        → valida parámetros
       └─ service.ts      → caso de uso de consulta
            └─ UbigeoRepository (interfaz)
                 └─ JsonUbigeoRepository         ← inyectado en index.ts

GET /health
  └─ health/controller.ts → { status: 'ok', uptime, version }
```

Responsabilidades:

- **Controller:** HTTP puro. Lee body/params, llama al servicio, devuelve el mismo shape actual. Sin lógica de negocio.
- **Service:** caso de uso. Orquesta y aplica reglas. No sabe si viene de HTTP o de un test.
- **Repository:** acceso a datos. Hoy JSON; mañana DB sin tocar el service.
- **MailSender:** abstracción del proveedor de correo. Permite cambiar SMTP por API de email.
- **Composition root (`index.ts`):** crea implementaciones concretas y las inyecta. Es el único lugar que conoce Nodemailer y la ruta del JSON.
- **Plugins:** request-id, logger, manejo de errores y shutdown.

Contrato observable a preservar por defecto:

```ts
// success
{ success: true }
// failure (mismo shape que hoy; el status HTTP se propone cambiar solo con aprobación)
{ success: false, message: 'Error al enviar correo' }
```

### 3.4 Frontend objetivo — componentes base

| Componente   | Props / API                                                                      | Slots                              | Comportamiento compartido                                               |
| ------------ | -------------------------------------------------------------------------------- | ---------------------------------- | ----------------------------------------------------------------------- |
| `BaseButton` | `variant`, `size`, `loading`, `disabled`, `as` (`button`/`a`/`NuxtLink`), `type` | `default`, `icon`, `label`         | focus visible, estados loading/disabled, `aria-busy`, el mismo `click`  |
| `BaseInput`  | `modelValue`, `label`, `type`, `error`, `hint`, `required`, `id`                 | `prefix`, `suffix`, `error`        | `aria-invalid`, `aria-describedby`, id auto-generado, formateo opcional |
| `BaseSelect` | `modelValue`, `options`, `placeholder`, `disabled`, `error`                      | `option`, `error`                  | misma a11y que `BaseInput`, opción vacía por defecto                    |
| `BaseModal`  | `open`, `title`, `closeOnOutside`, `closeOnEsc`                                  | `default`, `header`, `footer`      | focus trap, `aria-modal`, cierre con Escape, scroll lock                |
| `BaseCard`   | `to?`, `interactive?`, `elevation?`                                              | `media`, `title`, `body`, `footer` | misma semántica y zones, el contenido visual lo decide el feature       |

Regla: **estructura y comportamiento compartidos; diseño customizable por variantes/slots**. Los componentes de feature (`ContactForm`, `ProjectCard`, `ServiceCard`, `SiteHeader`, `SiteFooter`) los componen.

### 3.5 Arquitectura objetivo (tree completo)

```text
ccxp/
├── apps/
│   ├── api/
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── config/
│   │   │   │   └── env.ts
│   │   │   ├── plugins/
│   │   │   │   ├── logger.ts
│   │   │   │   ├── error-handler.ts
│   │   │   │   └── shutdown.ts
│   │   │   ├── modules/
│   │   │   │   ├── contact/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── controller.ts
│   │   │   │   │   ├── service.ts
│   │   │   │   │   ├── mail-transport.ts
│   │   │   │   │   ├── schemas.ts
│   │   │   │   │   └── template.ts
│   │   │   │   ├── ubigeo/
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── controller.ts
│   │   │   │   │   ├── service.ts
│   │   │   │   │   ├── repository.ts
│   │   │   │   │   ├── schemas.ts
│   │   │   │   │   └── data/ubigeo-peru.json
│   │   │   │   └── health/
│   │   │   │       └── controller.ts
│   │   │   └── shared/
│   │   │       ├── http-error.ts
│   │   │       ├── logger.ts
│   │   │       └── escape-html.ts
│   │   ├── tests/
│   │   │   ├── contact.service.test.ts
│   │   │   └── ubigeo.service.test.ts
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── web/
│       ├── app/
│       │   ├── app.vue
│       │   ├── components/
│       │   │   ├── ui/
│       │   │   │   ├── BaseButton.vue
│       │   │   │   ├── BaseInput.vue
│       │   │   │   ├── BaseSelect.vue
│       │   │   │   ├── BaseModal.vue
│       │   │   │   └── BaseCard.vue
│       │   │   └── features/
│       │   │       ├── home/
│       │   │       ├── projects/
│       │   │       ├── services/
│       │   │       ├── contact/
│       │   │       └── layout/
│       │   ├── composables/
│       │   ├── layouts/
│       │   ├── pages/
│       │   │   ├── index.vue
│       │   │   ├── proyectos/index.vue
│       │   │   ├── proyectos/[id].vue
│       │   │   └── servicios/[slug].vue
│       │   ├── styles/
│       │   │   ├── tokens.css
│       │   │   ├── base.css
│       │   │   └── utilities.css
│       │   └── types/
│       ├── public/
│       │   ├── images/
│       │   ├── videos/
│       │   ├── robots.txt
│       │   └── sitemap.xml
│       ├── nuxt.config.ts
│       ├── Dockerfile
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── contracts/
│   │   ├── src/
│   │   │   ├── contact.ts
│   │   │   ├── ubigeo.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── config/
│       ├── eslint/base.js
│       ├── prettier/index.json
│       ├── tsconfig/base.json
│       ├── package.json
│       └── tsconfig.json
│
├── deploy/
│   ├── docker-compose.yml
│   └── nginx/
│       └── ccip.conf
│
├── .env.example
├── .gitattributes
├── .gitignore
├── .prettierignore
├── .prettierrc
├── eslint.config.mjs
├── nuxt.config.ts            # solo si se decide keep en root; si no, se elimina tras mover
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── README.md
└── ANALISIS_Y_PLAN_DE_MIGRACION.md
```

> `demo/` no aparece en el tree objetivo porque está sin trackear y no es parte del producto. Si se decide conservarlo, se añadirá como `apps/demo` con su propio `package.json` y excluido de build/lint de producción.

---

## 4. Pasos a seguir, uno por uno, con fases

> Regla de cada fase: **no avanzar hasta que todas las verificaciones pasen**.  
> Comando de verificación estándar (se ejecuta al final de cada fase):

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm typecheck
pnpm lint
pnpm format:check
pnpm audit
```

### Fase 0 — Decisiones y seguridad inmediata

**Objetivo:** desbloquear el plan y contener el secreto expuesto.

1. Aprobar o ajustar la arquitectura de este documento.
2. **Rotar la app password de Gmail** en el proveedor de correo (fuera del repo).
3. Confirmar runtime del VPS: Node 24 LTS.
4. Confirmar modo de deploy: Docker Compose (recomendado) o PM2 + Nginx.
5. Confirmar proxy/TLS: Nginx + Let's Encrypt (recomendado) o Caddy.
6. Confirmar dominio de producción para `sitemap.xml`, `robots.txt` y CORS.
7. Decidir qué hacer con `demo/`: excluir, aislar o migrar.
8. Decidir si se reescribe el historial de Git para borrar el secreto (reescritura + force push; requiere coordinación).
9. Confirmar que se mantiene el flujo actual: email + apertura de WhatsApp, URLs y static JSON.

**Gate:** decisiones registradas; credencial rotada. No se toca código.

---

### Fase 1 — Línea base verde (sin mover archivos, sin actualizar deps)

**Objetivo:** que `typecheck`, `lint` y `format:check` pasen antes de refactorizar.

1. Tipar `ubigeo-peru.json` con un tipo `Record<string, Record<string, string[]>>` y usarlo en los 3 handlers. **Sin `any` ni `@ts-ignore`.**
2. Corregir errores de ESLint que no cambian comportamiento:
   - quitar `validarFormulario` y `goToSlide` no usados (o usarlos si ya se usaban visualmente);
   - reemplazar `navigate(section: any)` por `SectionId`;
   - reemplazar el `as any` del transporter por el tipo real de Nodemailer;
   - sustituir `delete errores[k]` por construcción de un objeto filtrado;
   - envolver las páginas multi-root en un único `<div>`;
   - renombrar `Header.vue` / `Footer.vue` a `SiteHeader.vue` / `SiteFooter.vue` (o configurar la regla temporalmente, sin cambiar markup).
3. Decidir el alcance de ESLint sobre `demo/`: ignorarlo en `eslint.config.mjs` o excluirlo del repo.
4. Añadir `.gitattributes` con `* text=auto eol=lf`.
5. Normalizar saltos de línea a LF y ejecutar `prettier --write` **en una sola fase** para que el diff sea fácil de revisar.
6. Ajustar `.prettierrc` a `tabWidth: 2` para coincidir con el código real.
7. Corregir `.vscode/launch.json` de `8080` a `3000`.

**Gate:** los 6 comandos de verificación pasan. Sin cambios de dependencias.

---

### Fase 2 — Skeleton del monorepo (sin mover lógica aún)

**Objetivo:** crear workspace real.

1. Añadir a `pnpm-workspace.yaml`:

   ```yaml
   packages:
     - 'apps/*'
     - 'packages/*'
   ```

   Conservando `allowBuilds` y `minimumReleaseAgeExclude`.

2. Crear `package.json` root con scripts:
   - `dev`, `build`, `typecheck`, `lint`, `format`, `format:check`
   - versiones `-r` / `--filter` apropiadas.
3. Crear `tsconfig.base.json` con `strict: true`, `noEmit`, `moduleResolution: Bundler`.
4. Crear `packages/config` y `packages/contracts` vacíos pero instalables (`workspace:*`).
5. Mover el proyecto Nuxt actual a `apps/web` con `git mv` (app/, public/, nuxt.config.ts, tsconfig.json, package.json, eslint config).
6. Actualizar paths de alias `@/` y `~/` para que sigan resolviendo igual.
7. Verificar build y las 4 rutas.

**Gate:** build + typecheck + lint + smoke test de `/`, `/proyectos`, `/proyectos/1`, `/servicios/<slug>`.

---

### Fase 3 — Extracción de la API

**Objetivo:** `apps/api` independiente, mismas rutas públicas.

1. Crear `apps/api` con `nitropack` y `package.json` propio.
2. Mover los 4 handlers desde `server/api` a la estructura por dominio, **sin cambiar lógica todavía**.
3. Mover `ubigeo-peru.json` a `apps/api/src/modules/ubigeo/data/`.
4. Mover la configuración SMTP a variables de entorno reales (sin commitear valores).
5. Configurar en `apps/web` un proxy de dev: `/api/**` → `http://localhost:3001`.
6. Documentar el contrato actual de las 4 rutas.

**Gate:** `curl` a los 4 endpoints devuelve exactamente lo mismo que antes; build de ambos apps pasa.

---

### Fase 4 — Contratos compartidos y configuración

**Objetivo:** una sola fuente de tipos y validación.

1. En `packages/contracts`, crear esquemas Zod:
   - `ContactRequestSchema` con los 11 campos actuales;
   - `UbigeoParamsSchema`;
   - tipos inferidos `ContactRequest`, `UbigeoResponse`.
2. Migrar `app/types/*.types.ts` para reexportar desde `@ccxp/contracts` donde aplique.
3. Usar los esquemas en el controller de `contacto` y en los de `ubigeo`.
4. Centralizar ESLint/Prettier/tsconfig en `packages/config` y que `apps/*` los extiendan.

**Gate:** typecheck + lint + tests de esquemas (si ya existe Vitest; si no, se añade en esta fase).

---

### Fase 5 — Dependencias por grupos

**Objetivo:** actualizar sin mezclar causas de regresión.

1. **Grupo 5a — tooling:** pnpm `12.23.0`, `eslint 10.16.0`, `eslint-config-prettier 10.1.9`, `@types/node 24.19.4`, lockfile. Verificar.
2. **Grupo 5b — framework:** `nuxt 4.7.0` + compatibilidad Nitro/Vite. Verificar SSR y rutas.
3. **Grupo 5c — TypeScript:** mantener `5.9.3`. En rama/estado separado, probar `7.0.2` con `vue-tsc` y Nuxt; si falla, documentar y descartar. **Nunca parchear con `any`/`@ts-ignore`.**
4. **Grupo 5d — auditoría:** añadir `pnpm.overrides` para `minimatch@11.0.1`; ejecutar build + `pnpm audit` hasta quedar en 0.

**Gate:** cada sub-fase termina verde; se registra la versión exacta instalada.

---

### Fase 6 — Backend SOLID y operabilidad

**Objetivo:** separar responsabilidades sin cambiar el contrato.

1. Crear `config/env.ts` con `@t3-oss/env-core` + Zod: `NODE_ENV`, `PORT`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASSWORD`, `MAIL_FROM`, `MAIL_TO`, `CORS_ORIGINS`, `LOG_LEVEL`.
2. Crear la interfaz `MailSender` y la implementación `SmtpMailSender` con Nodemailer tipado.
3. Crear `ContactService`: valida, escapa HTML, compone asunto/cuerpo, delega envío.
4. Crear `UbigeoRepository` + `JsonUbigeoRepository` y `UbigeoService`.
5. Convertir los controllers en capas delgadas que usen los servicios inyectados desde `index.ts`.
6. Añadir `escape-html.ts` y usarlo en todos los campos del correo.
7. Añadir `/health` con `{ status, uptime, version }`.
8. Añadir `pino` + `pino-http` con request-id; **no loguear el body completo**.
9. Añadir manejo de errores centralizado y graceful shutdown en `SIGTERM`/`SIGINT`.
10. Añadir tests Vitest de `ContactService` y `UbigeoService` con fakes.

**Gate:** mismas respuestas HTTP que antes (salvo el cambio de status de error si se aprueba explícitamente), health OK, logs JSON, shutdown limpio.

---

### Fase 7 — Secretos, CORS y proxy

**Objetivo:** eliminar rastros de credenciales y fijar el boundary HTTP.

1. Borrar `app/data/contact-config.json` del árbol (ya movido a env en Fase 3/6).
2. Crear `.env.example` con nombres de variables y valores vacíos/placeholder.
3. Verificar que `.gitignore` ignora `.env` y `.env.*` excepto `.env.example`.
4. Configurar Nginx:
   - `/api/` → `http://api:3001`;
   - `/` → `http://web:3000`;
   - caché y compresión para assets;
   - `limit_req` en `/api/contacto`.
5. CORS: mismo origen por defecto; si se requiere otro origen, allow-list desde `CORS_ORIGINS`, sin `*`.
6. Generar `sitemap.xml` y `robots.txt` en runtime desde `NUXT_PUBLIC_SITE_URL` (implementado en Step 5 SEO).
7. Solo si se aprobó: reescribir historial para eliminar el secreto y coordinar force push.

**Gate:** `grep` del repo no encuentra credenciales; los endpoints responden correctamente a través del proxy.

---

### Fase 8 — Componentización del frontend

**Objetivo:** UI reutilizable sin cambiar la apariencia.

1. Crear `BaseButton`, `BaseInput`, `BaseSelect`, `BaseModal`, `BaseCard` con slots/variants y a11y.
2. Migrar `ContactSection.vue` a `features/contact/ContactForm.vue` usando los componentes base.
3. Migrar `Header.vue`/`Footer.vue` a `features/layout/SiteHeader.vue`/`SiteFooter.vue`.
4. Migrar tarjetas de `proyectos` y `servicios` a `BaseCard` / `BaseButton`.
5. Extraer tokens a `styles/tokens.css`; mover CSS por feature.
6. Comparar screenshots antes/después de cada página.

**Gate:** diff visual aprobado; lint a11y sin errores nuevos; build/typecheck verdes.

---

### Fase 9 — VPS y deployment

**Objetivo:** desplegable reproducible.

1. Dockerfile multi-stage para `apps/web` (build → `node .output/server/index.mjs`).
2. Dockerfile multi-stage para `apps/api` (build → Nitro node-server).
3. Usuarios no root, `NODE_ENV=production`, `corepack enable`/pnpm en la etapa de build.
4. `deploy/docker-compose.yml` con servicios `web`, `api`, `nginx`:
   - `restart: unless-stopped`;
   - `depends_on` con healthchecks;
   - límites de memoria sugeridos: web 512 MB, api 256 MB, nginx 64 MB (ajustar tras medir);
   - volumen `.env` solo en api/web.
5. `deploy/nginx/ccip.conf` con TLS (Let's Encrypt), HTTP→HTTPS, `/api` proxy, gzip/brotli, timeouts y rate limit.
6. Healthchecks de Compose contra `GET /health` y `GET /`.
7. Probar `docker compose up -d`, `curl https://<dominio>/health`, `curl https://<dominio>/api/ubigeo/departamentos`.
8. Documentar update: `git pull` → `pnpm install --frozen-lockfile` → `pnpm build` → `docker compose up -d --build`.

**Gate:** deploy limpio en un VPS de prueba; health verde; smoke test completo.

---

### Fase 10 — Cierre y_documentación

**Objetivo:** dejar el repo listo para el equipo.

1. README final con:
   - requisitos (Node, pnpm, Docker);
   - setup local;
   - scripts;
   - arquitectura;
   - convenciones (naming, feature folders, commits);
   - deploy y rollback.
2. Decidir destino final de `demo/`.
3. Optimización opcional de assets (convertir jpg/jpeg a webp, comprimir video) **solo con aprobación**.
4. Verificación final de todos los comandos y auditoría.

**Gate:** `pnpm audit` sin vulnerabilidades; documentación actualizada; aceptación del equipo.

---

## 5. Estructura final del proyecto (tree definitivo)

```text
ccxp/
├── apps/
│   ├── api/                                  # Backend independiente (Nitro)
│   │   ├── src/
│   │   │   ├── main.ts                       # Entry + arranque
│   │   │   ├── config/env.ts                 # Env validada al iniciar
│   │   │   ├── plugins/
│   │   │   │   ├── logger.ts                 # pino + request-id
│   │   │   │   ├── error-handler.ts          # Errores centralizados
│   │   │   │   └── shutdown.ts               # SIGTERM/SIGINT
│   │   │   ├── modules/
│   │   │   │   ├── contact/                  # Dominio: contacto
│   │   │   │   │   ├── index.ts              # Composition root (DI)
│   │   │   │   │   ├── controller.ts         # HTTP delgado
│   │   │   │   │   ├── service.ts            # Caso de uso
│   │   │   │   │   ├── mail-transport.ts     # Interfaz + SMTP impl
│   │   │   │   │   ├── template.ts           # HTML escapado
│   │   │   │   │   └── schemas.ts            # Zod request/response
│   │   │   │   ├── ubigeo/                   # Dominio: ubigeo
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── controller.ts
│   │   │   │   │   ├── service.ts
│   │   │   │   │   ├── repository.ts         # Interfaz + JSON impl
│   │   │   │   │   ├── schemas.ts
│   │   │   │   │   └── data/ubigeo-peru.json
│   │   │   │   └── health/
│   │   │   │       └── controller.ts         # GET /health
│   │   │   └── shared/
│   │   │       ├── http-error.ts
│   │   │       ├── logger.ts
│   │   │       └── escape-html.ts
│   │   ├── tests/
│   │   │   ├── contact.service.test.ts
│   │   │   └── ubigeo.service.test.ts
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── web/                                  # Frontend Nuxt 4 (SSR)
│       ├── app/
│       │   ├── app.vue
│       │   ├── components/
│       │   │   ├── ui/                       # Primitivas reutilizables
│       │   │   │   ├── BaseButton.vue
│       │   │   │   ├── BaseInput.vue
│       │   │   │   ├── BaseSelect.vue
│       │   │   │   ├── BaseModal.vue
│       │   │   │   └── BaseCard.vue
│       │   │   └── features/                 # Componentes por dominio
│       │   │       ├── home/
│       │   │       ├── projects/
│       │   │       ├── services/
│       │   │       ├── contact/
│       │   │       └── layout/
│       │   │           ├── SiteHeader.vue
│       │   │           └── SiteFooter.vue
│       │   ├── composables/                  # Solo estado/comportamiento UI
│       │   ├── layouts/
│       │   ├── pages/                        # Mismas URLs públicas
│       │   │   ├── index.vue
│       │   │   ├── proyectos/index.vue
│       │   │   ├── proyectos/[id].vue
│       │   │   └── servicios/[slug].vue
│       │   ├── styles/
│       │   │   ├── tokens.css
│       │   │   ├── base.css
│       │   │   └── utilities.css
│       │   └── types/
│       ├── public/
│       │   ├── images/
│       │   ├── videos/
│       │   ├── robots.txt
│       │   └── sitemap.xml
│       ├── nuxt.config.ts
│       ├── Dockerfile
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   ├── contracts/                            # Tipos + Zod compartidos
│   │   ├── src/
│   │   │   ├── contact.ts
│   │   │   ├── ubigeo.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── config/                               # Config compartida
│       ├── eslint/base.js
│       ├── prettier/index.json
│       ├── tsconfig/base.json
│       ├── package.json
│       └── tsconfig.json
│
├── deploy/
│   ├── docker-compose.yml                    # web + api + nginx
│   └── nginx/ccip.conf                       # Reverse proxy + HTTPS + /api
│
├── .env.example                              # Committed, sin secretos
├── .gitattributes                            # LF obligatorio
├── .gitignore
├── .prettierignore
├── .prettierrc
├── eslint.config.mjs
├── package.json                              # Scripts raíz pnpm -r
├── pnpm-lock.yaml
├── pnpm-workspace.yaml                       # apps/* + packages/*
├── tsconfig.base.json                        # strict: true
├── README.md                                 # Setup + scripts + deploy
└── ANALISIS_Y_PLAN_DE_MIGRACION.md           # Este documento
```

### Convenciones que acompañan al tree final

- `index.ts` en cada módulo del API = único lugar de composición/dependencias.
- `controller.ts` nunca contiene reglas de negocio.
- `service.ts` nunca importa Nodemailer ni HTTP directamente.
- `repository.ts` es el único que conoce la ubicación del JSON.
- En `web`, `components/ui` no conoce dominio; `components/features` sí.
- Un feature puede importar `ui`, pero `ui` nunca importa `features`.
- Los tipos de contrato se importan desde `@ccxp/contracts`, nunca se duplican.
- Todo secret entra por `process.env` validado; ningún `.env` se commitea.
- Toda fase nueva añade tests antes de considerarla terminada.

---

## 6. Etapa 1 — Traducción del demo visual (`experiment/`) a Nuxt 4

Trabajo realizado **solo dentro de `experiment/`**. El padre (`apps/*`, `packages/*`, `deploy/*`) no se modificó en esta etapa. El demo es el futuro frontend; sus piezas se moverán a `apps/web` en una etapa posterior, previa aprobación visual.

### 6.1 Decisiones aprobadas

| Decisión              | Valor elegido                                                                            |
| --------------------- | ---------------------------------------------------------------------------------------- |
| Stack del demo        | Nuxt `4.7.0` + Vue `3.5.46`, `srcDir: 'app'`, alias `~` → `app/`                         |
| Preflight de Tailwind | **Se mantiene** (el diseño aprobado depende de él; el padre lo desactivó)                |
| Configuración         | Local espejo del padre: **cero imports** hacia `../../` ni `@ccxp/*`                     |
| Gestor de paquetes    | `npm` dentro de `experiment/`; **`experiment/` queda fuera de `pnpm-workspace.yaml`**    |
| Iconos                | `@lucide/vue@1.82.0` (no `lucide-vue-next@1.0.0`, deprecado)                             |
| Tailwind              | `tailwindcss` / `@tailwindcss/vite` `4.1.17` para conservar el bundle aprobado           |
| TypeScript            | `5.9.3` (TS 7 ya descartado: `vue-tsc@3.3.14` falla con `ERR_PACKAGE_PATH_NOT_EXPORTED`) |
| Auditoría             | `overrides.minimatch = 11.0.1`, mismo criterio que el padre                              |

### 6.2 Línea base visual congelada

- `experiment/qa/baseline/aprobado-index.html`, 31 capturas originales y 12 capturas deterministas: **intactas**.
- `experiment/src/**`, `index.html` y `vite.config.ts` (fuentes React/Vite originales): **intactos y excluidos** de ESLint y Prettier.
- `app/assets/css/tailwind.css` es copia **byte-exacta** de `src/index.css` (hash SHA-256 `63759177…24AA7`) y está excluida de Prettier.
- `qa/capture.mjs` sigue bloqueado porque falta el binario `chromium_headless_shell-1255`; se usó el navegador integrado para comparar.

### 6.3 Mapa de migración (origen → destino)

| Origen (`experiment/src/`)   | Destino (`experiment/app/`)                                                      |
| ---------------------------- | -------------------------------------------------------------------------------- |
| `main.tsx`, `App.tsx`        | `app.vue`, `pages/index.vue`                                                     |
| `index.css`                  | `assets/css/tailwind.css` (literal), `assets/css/main.scss`                      |
| `lib/data.ts`                | `data/content.ts`, `types/content.types.ts`                                      |
| `utils/cn.ts`                | `utils/cn.ts`                                                                    |
| `components/Reveal.tsx`      | `components/base/BaseReveal.vue`                                                 |
| `components/ui.tsx`          | `components/ui/{BrandLogo,SectionHeading,ServiceIcon,ThemeToggle,StatusDot}.vue` |
| `components/Navbar.tsx`      | `features/layout/SiteHeader.vue`                                                 |
| `components/Footer.tsx`      | `features/layout/SiteFooter.vue`                                                 |
| `components/LegalDialog.tsx` | `features/legal/LegalDialog.vue`, `data/legal.ts`                                |
| `components/Hero.tsx`        | `features/hero/Hero.vue`                                                         |
| `components/PlanetScene.tsx` | `features/hero/PlanetScene.vue`                                                  |
| `components/TrustBar.tsx`    | `features/trust/TrustBar.vue`                                                    |
| `components/Services.tsx`    | `features/services/Services.vue`                                                 |
| `components/Approach.tsx`    | `features/about/Approach.vue`                                                    |
| `components/About.tsx`       | `features/about/About.vue`                                                       |
| `components/Blog.tsx`        | `features/blog/Blog.vue`                                                         |
| `components/Contact.tsx`     | `features/contact/Contact.vue`, `features/contact/ProjectCard.vue` (extraído)    |
| hooks inline en componentes  | `composables/{useInView,useTheme,useLanding,useDialog}.ts`                       |
| `utils/icons` en `ui.tsx`    | `utils/icons.ts`                                                                 |

No quedan componentes duplicados: `Capabilities.vue` se renombró a `features/about/Approach.vue` y la home referencia solo ese nombre.

### 6.4 Verificación de la Etapa 1

| Comando (`cwd=experiment/`)        | Resultado                                            |
| ---------------------------------- | ---------------------------------------------------- |
| `npm ci`                           | ✅ 759 paquetes, `postinstall: nuxt prepare`         |
| `npm run typecheck`                | ✅ sin errores                                       |
| `npm run lint`                     | ✅ 0 errores, 0 warnings                             |
| `npm run format:check`             | ✅ todos los archivos (fuentes congeladas excluidas) |
| `npm run build`                    | ✅ cliente 994.92 kB (276.02 kB gzip)                |
| `npm audit --audit-level moderate` | ✅ 0 vulnerabilidades                                |

**Paridad visual contra `aprobado-index.html`** (mismo viewport, tema oscuro, CSS determinista en ambas páginas):

- Idénticos: `body`/`header`/`h1`, las 6 secciones con cajas exactas (`inicio` 762 px, `servicios` 1094, `capacidades` 1745, `nosotros` 641, `blog` 1260, `contacto` 1340), longitud de texto 6811 caracteres, contadores de elementos, `bodyHeight` 8516, canvas WebGL y logo.
- Únicas diferencias de DOM: el wrapper `#__nuxt` y los scripts de hidratación, esperados.
- Diferencia de píxeles: 0,07 % en secciones estáticas y ~1 % en la home; procede del canvas WebGL animado (estrellas/planeta), que no es determinista.
- Sin errores de consola.

**Interacciones verificadas:** toggle de tema (clase `dark`, `localStorage.ccip-theme`, `theme-color`), navegación/anclas y `requestQuote` con preselección, validación del formulario (4 errores y foco en el primer campo), expansión "Completar solicitud", envío simulado con `setTimeout(1100)` y folio `CCIP-2026-XXXX`, y apertura/cierre del modal del blog.

**Advertencias no bloqueantes del build:** `css.devSourcemap` deprecado, chunks >500 kB por three.js/WebGL y avisos de sourcemap del plugin de Tailwind. No se aplicó "optimización de assets" (requiere aprobación).

**Ajuste posterior a la traducción:** se corrigió el `IntersectionObserver` de `BaseReveal.vue`: la ref se enlaza ahora con un callback (no con `:ref="nodeRef"`, que entregaba `null`) y las refs DOM usan `shallowRef` para evitar la deformación de tipos de Vue 3.5. Los 37 elementos `.reveal` vuelven a quedar ocultos (`opacity: 0`) y se activan progresivamente al scrollear. Además, `main.scss` añade un resaltado de hover con `--hover-highlight: #f0cf00` (borde, glow y texto) para enlaces, botones, tarjetas, `summary` y campos de formulario. Las animaciones existentes (`marquee`, `pulse-dot`, `drift`, `floaty-slow`, `rise-in`) siguen activas.

### 6.5 Guía para migrar piezas a `apps/web`

Orden recomendado, de menor a mayor riesgo:

1. **Tokens y estilos base:** llevar `app/assets/css/main.scss` y las variables a `styles/tokens.css`. **No copiar `tailwind.css` tal cual**: el padre desactivó el preflight. Requiere decisión explícita antes de moverlo.
2. **Primitivas UI** (`components/ui/*`, `BaseReveal.vue`): no conocen dominio; se mueven primero y se comparan con el golden.
3. **Composables** (`useTheme`, `useInView`, `useLanding`, `useDialog`): adaptar el tema al `runtimeConfig` del padre y conservar `localStorage.ccip-theme` y `?theme=`.
4. **Contenido** (`data/content.ts`, `types/content.types.ts`, `data/legal.ts`): revisar la fuente única de contenido del padre; no duplicar catálogos.
5. **Layout** (`SiteHeader`, `SiteFooter`, `LegalDialog`): mantener anclas `#inicio…#contacto` y el contrato histórico `POST /api/contacto` → 200 con `{ success: false, message: 'Error al enviar correo' }`.
6. **Features estáticas** en orden: `TrustBar` → `Services` → `Approach` → `About` → `Blog` → `Contact`/`ProjectCard`.
7. **`Hero` y `PlanetScene` al final:** WebGL es la pieza más sensible y la única que impide una comparación píxel a píxel.

**Conflictos a resolver con el usuario antes de mover:**

- Preflight de Tailwind (demo sí, padre no).
- Teléfonos discrepantes ya presentes en el demo: `+51 959 829 143` / `wa.me/51959829143` en contacto vs `+51 992 275 316` en el footer. **No se "corrigió"**; se conservó el diseño aprobado.
- Nombres de tokens/clases (`bg-bg-deep`, `panel`, `input`, `link-arrow`) frente a los del padre; hay que decidir si se renombran o se co-existen temporalmente.
- `apps/web` es SSR: hay que validar que el script síncrono de tema y el canvas WebGL no produzcan hydratación diferente.

---

## Estado actual de este documento

Las fases 0–10 del padre y la Etapa 1 de `experiment/` están ejecutadas y verificadas. El siguiente paso es la aprobación visual de la home migrada y, después, mover las piezas a `apps/web` siguiendo el orden de la sección 6.5. Cada movimiento debe conservar imports sin dependencias cruzadas, sin duplicados y con comparación visual contra `qa/baseline/`.
