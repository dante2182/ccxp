<script setup lang="ts">
import { cn } from '~/utils/cn'

withDefaults(
  defineProps<{
    eyebrow: string
    description?: string
    align?: 'center' | 'left'
    className?: string
  }>(),
  { align: 'center', description: '', className: '' },
)
</script>

<template>
  <div
    :class="
      cn(
        'flex flex-col',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className,
      )
    "
  >
    <div class="eyebrow">
      <span
        class="h-1.5 w-1.5 rounded-full bg-teal shadow-[0_0_10px_2px_color-mix(in_oklab,var(--accent)_35%,transparent)]"
      />
      {{ eyebrow }}
    </div>
    <h2
      class="mt-5 max-w-[19ch] text-[2.1rem] font-[700] leading-[1.04] tracking-[-0.045em] text-ink sm:text-[2.8rem] lg:text-[3.35rem]"
    >
      <slot name="title" />
    </h2>
    <p
      v-if="description || $slots.description"
      :class="
        cn(
          'mt-5 max-w-[58ch] text-[0.95rem] leading-relaxed text-muted sm:text-base',
          align === 'center' && 'mx-auto',
        )
      "
    >
      <slot name="description">{{ description }}</slot>
    </p>
  </div>
</template>
