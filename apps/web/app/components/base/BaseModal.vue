<template>
  <Teleport to="body">
    <div v-if="open" class="base-modal-backdrop" @click.self="close">
      <section
        :id="modalId"
        class="base-modal"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        tabindex="-1"
        @keydown.esc="close"
      >
        <header v-if="title || $slots.header" class="base-modal-header">
          <slot name="header">
            <h2 :id="titleId">{{ title }}</h2>
          </slot>
          <button type="button" class="base-modal-close" aria-label="Cerrar" @click="close">
            ×
          </button>
        </header>

        <div class="base-modal-body"><slot /></div>

        <footer v-if="$slots.footer" class="base-modal-footer"><slot name="footer" /></footer>
      </section>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onBeforeUnmount, useId, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    open: boolean
    title?: string
  }>(),
  {
    title: '',
  },
)

const emit = defineEmits<{
  'update:open': [value: boolean]
  close: []
}>()

const uid = useId()
const modalId = `base-modal-${uid}`
const titleId = `${modalId}-title`

function close() {
  emit('update:open', false)
  emit('close')
}

function onKeydown(event: KeyboardEvent) {
  if (props.open && event.key === 'Escape') close()
}

watch(
  () => props.open,
  (open) => {
    if (typeof document === 'undefined') return
    document.body.style.overflow = open ? 'hidden' : ''
  },
)

onBeforeUnmount(() => {
  if (typeof document !== 'undefined') document.body.style.overflow = ''
  if (typeof window !== 'undefined') window.removeEventListener('keydown', onKeydown)
})

if (typeof window !== 'undefined') window.addEventListener('keydown', onKeydown)
</script>
