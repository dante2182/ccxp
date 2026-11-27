<script setup lang="ts">
import { RadioTower } from '@lucide/vue'
import { serviceIcons } from '~/utils/icons'

withDefaults(defineProps<{ name: string; className?: string; strokeWidth?: number }>(), {
  className: '',
  strokeWidth: 1.6,
})
</script>

<template>
  <component
    :is="serviceIcons[name] ?? RadioTower"
    :class="className"
    :stroke-width="strokeWidth"
  />
</template>
