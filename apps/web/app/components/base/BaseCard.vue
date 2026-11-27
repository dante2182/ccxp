<template>
  <NuxtLink
    v-if="to"
    v-bind="$attrs"
    :to="to"
    :class="['base-card', `base-card--${variant}`, $attrs.class]"
  >
    <slot />
  </NuxtLink>

  <article v-else v-bind="$attrs" :class="['base-card', `base-card--${variant}`, $attrs.class]">
    <slot />
  </article>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    to?: string
    variant?: 'default' | 'project' | 'service'
  }>(),
  {
    to: undefined,
    variant: 'default',
  },
)
</script>
