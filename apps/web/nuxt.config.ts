// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-11-20',

  css: ['@/assets/css/main.css'],

  // Directorio fuente de la aplicación
  srcDir: 'app',

  modules: ['@nuxt/eslint'],

  // Configuración del servidor de desarrollo
  devServer: {
    port: 3000,
    host: 'localhost',
  },

  nitro: {
    compressPublicAssets: true,
  },

  // La URL pública se puede override en runtime con NUXT_PUBLIC_SITE_URL.
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL ?? 'https://tu-dominio.com',
    },
  },

  // El SSR resuelve $fetch('/api/...') contra el propio Nitro, así que el
  // proxy debe existir también en producción. En el VPS apuntará al
  // servicio interno de la API (NUXT_API_TARGET=http://api:3001).
  // El sufijo /api/** conserva el prefijo de las rutas de la API.
  routeRules: {
    '/api/**': {
      proxy: `${process.env.NUXT_API_TARGET ?? 'http://localhost:3001'}/api/**`,
    },
  },

  // Configuración global de la app
  app: {
    head: {
      htmlAttrs: {
        lang: 'es',
      },
      title: 'CCIP - Nuxt 4',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Proyecto Nuxt 4' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
})
