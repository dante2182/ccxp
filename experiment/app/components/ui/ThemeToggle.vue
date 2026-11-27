<script setup lang="ts">
import { Moon, Sun } from '@lucide/vue'
import { cn } from '~/utils/cn'
import type { Theme } from '~/types/content.types'

const props = defineProps<{ theme: Theme }>()
defineEmits<{ toggle: [] }>()

const isDark = computed(() => props.theme === 'dark')
</script>

<template>
  <button
    type="button"
    data-theme-toggle
    :aria-label="isDark ? 'Activar modo claro' : 'Activar modo oscuro'"
    :title="isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'"
    class="group relative inline-flex h-10 w-[4.3rem] shrink-0 items-center rounded-full border border-line-strong bg-surface-2/70 p-1 transition-colors hover:border-accent/50"
    @click="$emit('toggle')"
  >
    <span
      :class="
        cn(
          'relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-surface shadow-[0_3px_10px_rgba(2,12,27,0.22)] ring-1 ring-line transition-transform duration-[450ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]',
          isDark ? 'translate-x-0' : 'translate-x-[1.8rem]',
        )
      "
    >
      <Moon v-if="isDark" class="h-4 w-4 text-accent" :stroke-width="1.9" />
      <Sun v-else class="h-4 w-4 text-accent" :stroke-width="1.9" />
    </span>
    <span
      class="pointer-events-none absolute inset-y-0 right-2 flex items-center text-muted/60 transition-all duration-300 group-hover:text-muted"
    >
      <Sun v-if="isDark" class="h-3.5 w-3.5" :stroke-width="2" />
      <Moon v-else class="h-3.5 w-3.5" :stroke-width="2" />
    </span>
    <span class="sr-only">Cambiar tema</span>
  </button>
</template>
