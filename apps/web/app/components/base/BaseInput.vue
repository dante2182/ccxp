<template>
  <template v-if="multiline">
    <textarea
      v-bind="$attrs"
      :id="inputId"
      :value="modelValue"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="error ? errorId : undefined"
      :class="{ 'input-error': Boolean(error) }"
      @input="onInput"
      @blur="$emit('blur', $event)"
    />
    <span v-if="error" :id="errorId" class="error-msg" role="alert">{{ error }}</span>
  </template>

  <template v-else>
    <input
      v-bind="$attrs"
      :id="inputId"
      :value="modelValue"
      :aria-invalid="error ? 'true' : undefined"
      :aria-describedby="error ? errorId : undefined"
      :class="{ 'input-error': Boolean(error) }"
      @input="onInput"
      @blur="$emit('blur', $event)"
    />
    <span v-if="error" :id="errorId" class="error-msg" role="alert">{{ error }}</span>
  </template>
</template>

<script setup lang="ts">
import { useId } from 'vue'

defineOptions({ inheritAttrs: false })

withDefaults(
  defineProps<{
    modelValue: string
    error?: string
    multiline?: boolean
  }>(),
  {
    error: '',
    multiline: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  blur: [event: FocusEvent]
}>()

const uid = useId()
const inputId = `base-input-${uid}`
const errorId = `${inputId}-error`

function onInput(event: Event) {
  const target = event.target
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
    emit('update:modelValue', target.value)
  }
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
.error-msg {
  display: block;
  color: var(--ccip-danger);
  font-size: 0.85rem;
  margin-top: 0.3rem;
  font-weight: 500;
}
</style>
