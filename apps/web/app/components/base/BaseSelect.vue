<template>
  <select
    v-bind="$attrs"
    :id="selectId"
    :value="modelValue"
    :aria-invalid="error ? 'true' : undefined"
    :aria-describedby="error ? errorId : undefined"
    :class="{ 'input-error': Boolean(error) }"
    @change="onChange"
    @blur="$emit('blur', $event)"
  >
    <slot />
  </select>
  <span v-if="error" :id="errorId" class="error-msg" role="alert">{{ error }}</span>
</template>

<script setup lang="ts">
import { useId } from 'vue'

defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    modelValue: string
    error?: string
  }>(),
  {
    error: '',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [event: Event]
  blur: [event: FocusEvent]
}>()

const uid = useId()
const selectId = `base-select-${uid}`
const errorId = `${selectId}-error`

function onChange(event: Event) {
  const target = event.target
  if (target instanceof HTMLSelectElement) {
    emit('update:modelValue', target.value)
  }
  emit('change', event)
}
</script>

<style scoped>
.input-error {
  border-color: var(--ccip-danger) !important;
  background-color: var(--ccip-danger-soft) !important;
}
.input-error:focus {
  border-color: var(--ccip-danger) !important;
  box-shadow: var(--ccip-focus-ring-danger) !important;
}
select:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: var(--ccip-disabled-bg);
}
.error-msg {
  display: block;
  color: var(--ccip-danger);
  font-size: 0.85rem;
  margin-top: 0.3rem;
  font-weight: 500;
}
</style>
