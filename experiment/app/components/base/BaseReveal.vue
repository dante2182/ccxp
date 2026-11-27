<script setup lang="ts">
import { computed } from 'vue'
import { useInView } from '~/composables/useInView'
import { cn } from '~/utils/cn'

const props = withDefaults(
  defineProps<{
    as?: string
    delay?: number
  }>(),
  { as: 'div', delay: 0 },
)

const { ref: nodeRef, inView } = useInView<HTMLElement>()
const setNode = (el: unknown) => {
  nodeRef.value = el as HTMLElement | null
}
const style = computed(() => ({ '--reveal-delay': `${props.delay}ms` }))
</script>

<template>
  <component :is="as" :ref="setNode" :class="cn('reveal', inView && 'is-visible')" :style="style">
    <slot />
  </component>
</template>
