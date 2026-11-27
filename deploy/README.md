# Deploy en VPS

Arquitectura: Nginx (TLS + `/api`) → `web` (Nuxt SSR) y `api` (Nitro). El proxy SSR de Nuxt también apunta al servicio interno `api`, porque `$fetch('/api/...')` se resuelve dentro del propio Nitro.

## Requisitos

- Node.js `>=24` y pnpm `12.23.0` solo para verificación local.
- Docker `>=29` con Compose `>=5`.
- Dominio con DNS apuntando al VPS (registros `@` y `www`).
- Puertos `80` y `443` libres.

## Archivos

```text
deploy/
├── docker-compose.yml   # web + api + nginx (+ certbot opcional)
├── nginx/ccip.conf      # HTTP→HTTPS, /api, /health, caché y headers
└── certbot/             # se crea al emitir certificados (no versionar)
```

Los Dockerfiles están junto a cada app (`apps/api/Dockerfile`, `apps/web/Dockerfile`) y usan la raíz del repo como contexto de build. `.dockerignore` excluye `node_modules`, outputs y `demo/`.

## 1. Configuración

Desde la raíz del repo:

```bash
cp .env.example .env
```

Rellena en `.env` los valores SMTP reales y `NUXT_PUBLIC_SITE_URL=https://tu-dominio.com`. `NUXT_PUBLIC_SITE_URL` se usa en runtime para `canonical` y `og:url` de cada ruta, y para generar `sitemap.xml` y `robots.txt`; ya no hay archivos estáticos que editar.

Reemplaza `tu-dominio.com` por el dominio real en:

- `deploy/nginx/ccip.conf`
- los comandos de certbot de esta guía

El modo de deploy (Docker Compose o PM2) sigue en evaluación; esta guía documenta Compose sin cambiar esa decisión.

> `NUXT_API_TARGET` se lee al compilar `apps/web`, no al arrancar. Compose ya pasa `NUXT_API_TARGET=http://api:3001` como build arg al Dockerfile de la web.

## 2. Certificado TLS inicial

Con el DNS ya propagado y antes de levantar Nginx (la configuración apunta a certificados que aún no existen):

```bash
mkdir -p deploy/certbot/conf deploy/certbot/www

docker run --rm -p 80:80 \
  -v "$PWD/deploy/certbot/conf:/etc/letsencrypt" \
  -v "$PWD/deploy/certbot/www:/var/www/certbot" \
  certbot/certbot:latest certonly --standalone \
  -d tu-dominio.com -d www.tu-dominio.com \
  --email admin@tu-dominio.com --agree-tos --no-eff-email
```

## 3. Arrancar

```bash
pnpm deploy:up
# o: docker compose -f deploy/docker-compose.yml up -d --build
```

Servicios y límites sugeridos:

| Servicio  | Imagen                          | Memoria | Healthcheck          |
| --------- | ------------------------------- | ------- | -------------------- |
| `api`     | `ccxp-api:${IMAGE_TAG:-latest}` | 256 MB  | `GET /health`        |
| `web`     | `ccxp-web:${IMAGE_TAG:-latest}` | 512 MB  | `GET /`              |
| `nginx`   | `nginx:1.29-alpine`             | 64 MB   | —                    |
| `certbot` | `certbot/certbot:latest`        | —       | renovación cada 12 h |

`web` espera a que `api` esté sano; `nginx` espera a ambos. `.env` se monta solo en `api` y `web`; `nginx` y `certbot` no reciben credenciales.

Para renovar certificados en caliente, arranca el perfil opcional:

```bash
docker compose -f deploy/docker-compose.yml --profile certbot up -d
```

## 4. Verificación

```bash
curl -I https://tu-dominio.com/
curl https://tu-dominio.com/health
curl https://tu-dominio.com/api/ubigeo/departamentos
curl -I https://tu-dominio.com/proyectos/1
```

El `health` y `/api/**` los sirve Nginx directamente desde `api`; el HTML y los assets desde `web`. `pnpm deploy:ps` muestra el estado y `pnpm deploy:logs` los logs.

## 5. Actualización

```bash
git pull
pnpm install --frozen-lockfile
pnpm typecheck && pnpm lint && pnpm test && pnpm build
pnpm deploy:up
```

El build de Docker vuelve a instalar con `--frozen-lockfile`, por lo que el `pnpm build` previo es solo verificación local.

## 6. Rollback

Opción rápida (misma imagen construida, sin cambios de código):

```bash
IMAGE_TAG=v1 pnpm deploy:up
```

Rollback real a un commit anterior:

```bash
git checkout <commit-o-tag-anterior>
pnpm install --frozen-lockfile
pnpm deploy:up
```

Para rollback sin recompilar, publica las imágenes en un registry y fija `IMAGE_TAG` a una versión ya construida.

## 7. Operación

- `pnpm deploy:down` baja los servicios (mantiene los volúmenes de certificados).
- La app password antigua debe rotarse en el proveedor; el historial de Git no se reescribió.
- `demo/` queda fuera del contexto de Docker y no se despliega.
- La optimización opcional de assets (convertir JPG/JPEG a WebP o comprimir el video) no se aplicó: requiere aprobación explícita.
