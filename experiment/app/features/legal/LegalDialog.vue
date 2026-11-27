<script setup lang="ts">
import { X } from '@lucide/vue'
import { LEGAL_DOCUMENTS } from '~/data/legal'
import { useDialog } from '~/composables/useDialog'
import type { LegalDocument } from '~/types/content.types'

const props = defineProps<{ docType: LegalDocument }>()
const emit = defineEmits<{ close: [] }>()

const closeButton = shallowRef<HTMLButtonElement | null>(null)
const setCloseButton = (el: unknown) => {
  closeButton.value = el as HTMLButtonElement | null
}
const isOpen = ref(false)
const close = () => emit('close')

useDialog(isOpen, close, closeButton)
onMounted(() => {
  isOpen.value = true
})

const document_ = computed(() => LEGAL_DOCUMENTS[props.docType])
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-[100] flex items-end justify-center bg-[#02060e]/70 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      @mousedown.self="close"
    >
      <section
        role="dialog"
        aria-modal="true"
        :aria-labelledby="`legal-${docType}-title`"
        class="flex max-h-[88svh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border border-line bg-surface shadow-2xl sm:rounded-2xl"
      >
        <div class="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-7">
          <div>
            <p class="eyebrow">
              {{ docType === 'terms' ? 'Información legal' : 'Datos personales' }}
            </p>
            <h2
              :id="`legal-${docType}-title`"
              class="mt-1 text-[1.2rem] font-semibold text-ink sm:text-[1.45rem]"
            >
              {{ document_.title }}
            </h2>
          </div>
          <button
            :ref="setCloseButton"
            type="button"
            aria-label="Cerrar documento"
            class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-surface-2 text-muted transition-colors hover:text-ink"
            @click="close"
          >
            <X class="h-4 w-4" />
          </button>
        </div>
        <div class="overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          <p class="mb-5 text-[0.7rem] text-muted/70">
            Última actualización: 27 de noviembre de 2026
          </p>
          <div class="flex flex-col gap-5">
            <section v-for="section in document_.sections" :key="section.heading">
              <h3 class="text-[0.82rem] font-semibold text-ink">{{ section.heading }}</h3>
              <p class="mt-1.5 text-[0.78rem] leading-[1.75] text-muted">{{ section.text }}</p>
            </section>
          </div>
        </div>
      </section>
    </div>
  </Teleport>
</template>
