<script setup lang="ts">
import { ArrowUpRight, CalendarDays, ChevronDown, Clock } from '@lucide/vue'
import { categoryIcons } from '~/utils/icons'
import { cn } from '~/utils/cn'
import type { Post } from '~/types/content.types'

defineProps<{ post: Post }>()
defineEmits<{ open: [post: Post] }>()

const categoryStyles: Record<string, string> = {
  telecom: 'border-accent/25 bg-accent/[0.08] text-accent',
  security: 'border-teal/25 bg-teal/[0.08] text-teal',
  energy: 'border-line-strong bg-surface-2 text-muted',
}
</script>

<template>
  <details
    class="interactive-card group relative min-h-[17rem] overflow-hidden rounded-2xl border border-line bg-surface/60 transition-all duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:scale-[1.012] hover:border-accent/40 hover:bg-surface hover:shadow-[var(--shadow-lift)]"
  >
    <summary
      class="flex min-h-[17rem] cursor-pointer list-none flex-col p-5 outline-none focus-visible:ring-2 focus-visible:ring-accent/70 focus-visible:ring-inset sm:p-6 [&::-webkit-details-marker]:hidden"
    >
      <span class="flex items-center justify-between gap-3">
        <span
          class="flex h-10 w-10 items-center justify-center rounded-xl border border-accent/20 bg-accent/8 text-accent"
        >
          <component :is="categoryIcons[post.categoryIcon]" class="h-5 w-5" :stroke-width="1.6" />
        </span>
        <span
          :class="
            cn(
              'rounded-full border px-2.5 py-1 text-[0.56rem] font-semibold uppercase tracking-[0.11em]',
              categoryStyles[post.categoryIcon],
            )
          "
        >
          {{ post.category }}
        </span>
      </span>

      <span
        role="heading"
        aria-level="3"
        class="mt-5 text-[1.05rem] font-[650] leading-[1.32] tracking-[-0.028em] text-ink"
      >
        {{ post.title }}
      </span>

      <span
        class="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-line pt-4 text-[0.66rem] text-muted/80"
      >
        <span class="inline-flex items-center gap-1.5">
          <CalendarDays class="h-3.5 w-3.5" :stroke-width="1.7" />
          {{ post.date }}
        </span>
        <span class="inline-flex items-center gap-1.5">
          <Clock class="h-3.5 w-3.5" :stroke-width="1.7" />
          {{ post.readTime }}
        </span>
      </span>

      <span class="mt-5 flex items-center justify-between text-[0.76rem] font-semibold text-accent">
        <span class="group-open:hidden">Ver descripción</span>
        <span class="hidden group-open:inline">Ocultar descripción</span>
        <ChevronDown class="h-4 w-4 transition-transform duration-300 group-open:rotate-180" />
      </span>
    </summary>

    <div class="px-5 pb-5 sm:px-6 sm:pb-6">
      <div class="rounded-xl border border-line bg-surface-2/50 p-4">
        <p class="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-accent">
          Descripción
        </p>
        <p class="mt-2 text-[0.78rem] leading-[1.68] text-muted">{{ post.excerpt }}</p>
      </div>
      <button
        type="button"
        class="mt-4 flex w-full items-center justify-between rounded-xl border border-line bg-surface-2/60 px-4 py-2.5 text-[0.78rem] font-semibold text-accent transition-all duration-300 hover:border-accent/40 hover:bg-accent/8"
        @click="$emit('open', post)"
      >
        Leer artículo completo
        <ArrowUpRight
          class="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </button>
    </div>
  </details>
</template>
