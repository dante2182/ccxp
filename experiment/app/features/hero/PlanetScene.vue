<script setup lang="ts">
import { cn } from '~/utils/cn'
import { usePlanetRenderer } from '~/composables/usePlanetRenderer'
import type { Theme } from '~/types/content.types'

const props = defineProps<{ theme: Theme; className?: string }>()
const { failed, setContainer } = usePlanetRenderer(() => props.theme)
</script>
<template>
  <div :ref="setContainer" :class="cn('relative h-full w-full select-none', className)">
    <div v-if="failed" class="absolute inset-0 flex items-center justify-center" aria-hidden="true">
      <div class="relative aspect-square w-[78%] max-w-[560px]">
        <div
          class="absolute inset-[8%] rounded-full bg-[radial-gradient(circle_at_32%_26%,color-mix(in_oklab,var(--accent)_48%,var(--surface))_0%,var(--bg-deep)_44%,var(--bg)_78%)] shadow-[0_0_120px_color-mix(in_oklab,var(--accent)_24%,transparent)]"
        >
          <div class="dot-grid absolute inset-0 rounded-full opacity-50" />
        </div>
        <div class="absolute inset-[3%] animate-spin-slow rounded-full border border-teal/40" />
        <div class="absolute inset-0 -rotate-[24deg] rounded-full border border-teal/25" />
        <div
          class="absolute left-[72%] top-[16%] h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_18px_6px_color-mix(in_oklab,var(--accent)_40%,transparent)]"
        />
      </div>
    </div>
    <div class="pointer-events-none absolute inset-0" aria-hidden="true">
      <div class="absolute right-[5%] top-[9%] hidden items-center gap-2 lg:flex">
        <span class="h-px w-10 bg-gradient-to-r from-transparent to-teal/70" />
        <span
          class="pulse-dot h-1.5 w-1.5 rounded-full bg-teal shadow-[0_0_10px_2px_color-mix(in_oklab,var(--accent)_35%,transparent)]"
        />
        <span
          class="rounded-md border border-line bg-glass px-2.5 py-1 text-[0.62rem] font-medium tracking-wide text-muted backdrop-blur-md"
        >
          Enlace satelital activo
        </span>
      </div>
    </div>
  </div>
</template>
