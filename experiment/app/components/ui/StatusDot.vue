<script setup lang="ts">
import { cn } from '~/utils/cn'

defineProps<{ className?: string }>()
</script>

<template>
  <span :class="cn('relative flex h-2 w-2', className)">
    <span
      class="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-40"
    />
    <span class="relative inline-flex h-2 w-2 rounded-full bg-accent" />
  </span>
</template>
