<script setup lang="ts">
import { useLanding } from '~/composables/useLanding'
import { useTheme } from '~/composables/useTheme'

const { ripple, syncFromDom } = useTheme()
const { handleSectionNavigation } = useLanding()

onMounted(syncFromDom)
</script>

<template>
  <div class="relative min-h-screen bg-bg text-ink" @click="handleSectionNavigation">
    <span
      v-if="ripple"
      :key="ripple.id"
      aria-hidden="true"
      class="pointer-events-none fixed z-[90] h-6 w-6 rounded-full bg-accent/25 blur-[2px]"
      :style="{
        left: `${ripple.x}px`,
        top: `${ripple.y}px`,
        animation: 'theme-ripple 0.9s cubic-bezier(0.16,1,0.3,1) forwards',
      }"
    />
    <a
      href="#contenido"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink focus:shadow-lg"
    >
      Saltar al contenido
    </a>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
