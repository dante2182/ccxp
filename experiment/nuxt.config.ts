import tailwindcss from '@tailwindcss/vite'

// Script síncrono: decide el tema antes de pintar, igual que el index.html original.
const themeScript = `(function () {
  var requested = new URLSearchParams(window.location.search).get("theme");
  var stored = null;
  try { stored = localStorage.getItem("ccip-theme"); } catch (e) {}
  var theme = requested === "light" || requested === "dark"
    ? requested
    : stored === "light" || stored === "dark" ? stored : "dark";
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
})();`

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-11-20',

  srcDir: 'app',

  css: ['@/assets/css/tailwind.css', '@/assets/css/main.scss'],

  modules: ['@nuxt/eslint'],

  // Se conserva el preflight del demo aprobado: la hoja es una copia byte-exacta
  // de src/index.css, procesada por el mismo plugin de Tailwind v4.
  vite: {
    plugins: [tailwindcss()],
  },

  components: {
    dirs: [
      { path: '~/components', pathPrefix: false },
      { path: '~/features', pathPrefix: false },
    ],
  },

  devServer: {
    port: 4173,
    host: 'localhost',
  },

  nitro: {
    compressPublicAssets: true,
  },

  app: {
    head: {
      htmlAttrs: { lang: 'es', class: 'dark' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { name: 'theme-color', content: '#061429' },
        {
          name: 'description',
          content:
            'CCIP Telecomunicaciones e Ingeniería: diseño, instalación y mantenimiento de redes, telecomunicaciones, seguridad electrónica y energía eléctrica en Arequipa y todo el Perú.',
        },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..750&display=swap',
        },
        { rel: 'icon', type: 'image/x-icon', href: '/logo_ccip.ico' },
      ],
      script: [{ innerHTML: themeScript, tagPriority: -1 }],
      title: 'CCIP · Redes y Telecomunicaciones | Ingeniería que conecta el Perú',
    },
  },
})
