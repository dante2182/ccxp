<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
const { public: publicConfig } = useRuntimeConfig()
const route = useRoute()

const canonicalUrl = computed(
  () => `${String(publicConfig.siteUrl).replace(/\/$/, '')}${route.path}`,
)

useHead({
  link: [
    { rel: 'canonical', href: canonicalUrl },
    {
      rel: 'preconnect',
      href: 'https://cdnjs.cloudflare.com',
      crossorigin: 'anonymous',
    },
    {
      rel: 'stylesheet',
      href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.scss',
    },
  ],
  meta: [{ property: 'og:url', content: canonicalUrl }],
})
</script>
<style>
/* Reset básico */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Scroll global */
html {
  scroll-behavior: smooth;
  scroll-padding-top: 120px; /* Altura del header sticky */
}

html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100%;

  overflow-x: hidden;
  overflow-y: auto;
}

/* Contenedor Nuxt */
#__nuxt {
  min-height: 100vh;
}

/* Respeto a accesibilidad */
@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}

@supports not (scroll-behavior: smooth) {
  html {
    scroll-behavior: auto;
  }
}
</style>
