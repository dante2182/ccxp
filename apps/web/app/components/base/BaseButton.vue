<template>
  <NuxtLink
    v-if="to"
    v-bind="$attrs"
    :to="to"
    :class="['base-button', `base-button--${variant}`, { loading }, $attrs.class]"
    @click="$emit('click', $event)"
  >
    <slot />
  </NuxtLink>

  <button
    v-else
    v-bind="$attrs"
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
    :class="['base-button', `base-button--${variant}`, { loading }, $attrs.class]"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    to?: string
    type?: 'button' | 'submit'
    variant?: 'primary' | 'ghost' | 'link'
    disabled?: boolean
    loading?: boolean
  }>(),
  {
    to: undefined,
    type: 'button',
    variant: 'primary',
    disabled: false,
    loading: false,
  },
)

defineEmits<{
  click: [event: MouseEvent]
}>()
</script>
