<script setup lang="ts">
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from '@lucide/vue'
import { CAPABILITIES, PROCESS } from '~/data/content'
import { useDialog } from '~/composables/useDialog'

const processSummaries = [
  'Revisamos la infraestructura y los requerimientos en campo.',
  'Definimos planos, equipos, plazos y presupuesto.',
  'Instalamos con seguridad y mínima interrupción.',
  'Documentamos, certificamos y capacitamos al equipo.',
]

const processDetails: Record<string, string[]> = {
  '01': [
    'Visita técnica a la sede',
    'Medición de la infraestructura existente',
    'Levantamiento de los requerimientos de operación',
  ],
  '02': [
    'Elaboración de planos y memoria de cálculo',
    'Selección y especificación de equipos',
    'Cronograma de trabajo y presupuesto',
  ],
  '03': [
    'Ejecución con protocolos de seguridad',
    'Supervisión durante la implementación',
    'Coordinación para reducir interrupciones',
  ],
  '04': [
    'Certificación de los tramos instalados',
    'Documentación técnica del proyecto',
    'Capacitación al equipo para el soporte',
  ],
}

const activeSlide = ref(0)
const selectedStage = ref<number | null>(null)
const closeStageButton = shallowRef<HTMLButtonElement | null>(null)
const setCloseStageButton = (el: unknown) => {
  closeStageButton.value = el as HTMLButtonElement | null
}
const activeCapability = computed(() => CAPABILITIES[activeSlide.value] ?? CAPABILITIES[0]!)
const currentStage = computed(() =>
  selectedStage.value === null ? null : (PROCESS[selectedStage.value] ?? null),
)
const stageDetails = computed(() =>
  currentStage.value ? (processDetails[currentStage.value.step] ?? []) : [],
)
const stageDialogOpen = computed(() => selectedStage.value !== null)
const close = () => {
  selectedStage.value = null
}

useDialog(stageDialogOpen, close, closeStageButton)

const changeSlide = (direction: number) => {
  activeSlide.value = (activeSlide.value + direction + CAPABILITIES.length) % CAPABILITIES.length
}
const previousStage = () => {
  if (selectedStage.value !== null) selectedStage.value = Math.max(0, selectedStage.value - 1)
}
const nextStage = () => {
  if (selectedStage.value !== null)
    selectedStage.value = Math.min(PROCESS.length - 1, selectedStage.value + 1)
}
</script>

<template>
  <section
    id="nosotros"
    class="relative isolate overflow-hidden border-y border-line bg-bg-deep/45 pt-5 pb-12 sm:pt-8 sm:pb-16 lg:pt-10 lg:pb-20"
  >
    <div
      class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_45%_at_12%_12%,var(--glow-a),transparent_72%)] opacity-45"
    />
    <div class="container-x">
      <div class="grid gap-4 md:grid-cols-[1fr_0.8fr] md:items-end">
        <BaseReveal>
          <SectionHeading eyebrow="Nosotros" align="left">
            <template #title>
              Ingeniería que acompaña <span class="gradient-text">cada etapa.</span>
            </template>
          </SectionHeading>
        </BaseReveal>
        <BaseReveal :delay="70">
          <p
            class="max-w-[48ch] border-l border-accent/30 pl-4 text-[0.82rem] leading-[1.7] text-muted md:mb-1"
          >
            Diseñamos, implementamos y damos soporte a infraestructura tecnológica para empresas,
            desde el diagnóstico hasta la operación.
          </p>
        </BaseReveal>
      </div>

      <div
        class="mt-8 grid gap-4 sm:mt-9 md:grid-cols-[0.92fr_1.08fr] md:items-stretch lg:mt-10 lg:gap-5"
      >
        <BaseReveal class="md:h-full">
          <div
            role="group"
            aria-roledescription="carrusel"
            aria-label="Capacidades de CCIP"
            class="group relative h-[250px] overflow-hidden rounded-3xl border border-line bg-surface-2 shadow-[var(--shadow-card)] sm:h-[310px] md:h-full md:min-h-[350px]"
          >
            <img
              :key="activeCapability.id"
              :src="activeCapability.image"
              :alt="activeCapability.imageAlt"
              loading="lazy"
              class="absolute inset-0 h-full w-full animate-rise object-cover"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-[#020a13]/85 via-transparent to-[#020a13]/10"
            />
            <span
              class="absolute left-4 top-4 rounded-full border border-white/20 bg-black/25 px-3 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-white/85 backdrop-blur-md"
            >
              CCIP · Ingeniería
            </span>
            <button
              type="button"
              aria-label="Imagen anterior"
              class="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
              @click="changeSlide(-1)"
            >
              <ChevronLeft class="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Imagen siguiente"
              class="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
              @click="changeSlide(1)"
            >
              <ChevronRight class="h-4 w-4" />
            </button>
            <div
              class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5"
            >
              <div aria-live="polite">
                <p class="text-[0.56rem] font-semibold uppercase tracking-[0.14em] text-teal">
                  Capacidad técnica
                </p>
                <p class="mt-1 text-[0.82rem] font-semibold text-white">
                  {{ activeCapability.label }}
                </p>
              </div>
              <div class="flex items-center gap-1.5">
                <button
                  v-for="(capability, index) in CAPABILITIES"
                  :key="capability.id"
                  type="button"
                  :aria-label="`Mostrar ${capability.label}`"
                  :aria-current="activeSlide === index ? 'true' : undefined"
                  :class="[
                    'h-1.5 rounded-full transition-all',
                    activeSlide === index ? 'w-5 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80',
                  ]"
                  @click="activeSlide = index"
                />
              </div>
            </div>
          </div>
        </BaseReveal>

        <BaseReveal :delay="90" class="md:h-full">
          <div
            class="h-full rounded-3xl border border-line bg-surface/60 p-4 shadow-[var(--shadow-card)] sm:p-5"
          >
            <div class="flex items-end justify-between gap-3 border-b border-line pb-3">
              <div>
                <p class="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-accent">
                  Cómo trabajamos
                </p>
                <h3 class="mt-1 text-[1.08rem] font-semibold tracking-[-0.02em] text-ink">
                  Un proceso en cuatro etapas
                </h3>
              </div>
              <span
                class="shrink-0 rounded-full border border-line bg-surface-2 px-2.5 py-1 text-[0.58rem] font-medium text-muted"
              >
                01 — 04
              </span>
            </div>

            <div class="mt-3 grid gap-2">
              <button
                v-for="(stage, index) in PROCESS"
                :key="stage.step"
                type="button"
                :aria-label="`Ver detalles de ${stage.title}`"
                aria-haspopup="dialog"
                class="group/stage relative flex w-full items-start gap-3 rounded-xl border border-line/80 bg-bg/25 px-3 py-2.5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/35 hover:bg-surface/55 hover:shadow-[var(--shadow-card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                @click="selectedStage = index"
              >
                <span
                  class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-accent/20 bg-accent/[0.06] text-[0.62rem] font-bold text-accent transition-all duration-300 group-hover/stage:scale-110 group-hover/stage:rotate-3 group-hover/stage:bg-accent/12"
                >
                  {{ stage.step }}
                </span>
                <span class="flex-1 pt-0.5">
                  <span class="block text-[0.8rem] font-semibold text-ink">{{ stage.title }}</span>
                  <span class="mt-0.5 block text-[0.68rem] leading-[1.45] text-muted">{{
                    processSummaries[index]
                  }}</span>
                </span>
                <ArrowUpRight
                  class="mt-1 h-3.5 w-3.5 shrink-0 text-muted/60 transition-all duration-300 group-hover/stage:translate-x-0.5 group-hover/stage:-translate-y-0.5 group-hover/stage:text-accent"
                />
              </button>
            </div>
          </div>
        </BaseReveal>
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="stageDialogOpen"
        class="fixed inset-0 z-[100] flex items-end justify-center bg-[#02060e]/70 p-0 backdrop-blur-sm sm:items-center sm:p-5"
        @mousedown.self="close"
      >
        <section
          role="dialog"
          aria-modal="true"
          aria-labelledby="process-stage-title"
          class="w-full max-w-xl overflow-hidden rounded-t-2xl border border-line bg-surface shadow-2xl sm:rounded-2xl"
        >
          <div class="flex items-start gap-4 border-b border-line p-5 sm:p-6">
            <span
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-accent/25 bg-accent/[0.08] text-[0.8rem] font-bold text-accent"
            >
              {{ currentStage!.step }}
            </span>
            <div class="min-w-0 flex-1">
              <p class="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-accent">
                Etapa {{ (selectedStage ?? 0) + 1 }} de {{ PROCESS.length }}
              </p>
              <h2
                id="process-stage-title"
                class="mt-1 text-[1.2rem] font-semibold tracking-[-0.025em] text-ink"
              >
                {{ currentStage!.title }}
              </h2>
            </div>
            <button
              :ref="setCloseStageButton"
              type="button"
              aria-label="Cerrar detalles de la etapa"
              class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-surface-2 text-muted transition-colors hover:text-ink"
              @click="close"
            >
              <X class="h-4 w-4" />
            </button>
          </div>

          <div class="p-5 sm:p-6">
            <p class="text-[0.84rem] leading-[1.7] text-muted">{{ currentStage!.text }}</p>
            <div class="mt-5 rounded-xl border border-line bg-surface-2/45 p-4">
              <p class="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-ink">
                En esta etapa
              </p>
              <ul class="mt-3 flex flex-col gap-2.5">
                <li
                  v-for="detail in stageDetails"
                  :key="detail"
                  class="flex items-start gap-2.5 text-[0.78rem] leading-[1.55] text-muted"
                >
                  <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                  {{ detail }}
                </li>
              </ul>
            </div>
          </div>

          <div class="flex items-center justify-between border-t border-line px-5 py-4 sm:px-6">
            <button
              type="button"
              :disabled="selectedStage === 0"
              class="inline-flex items-center gap-1.5 text-[0.75rem] font-medium text-muted transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
              @click="previousStage"
            >
              <ChevronLeft class="h-4 w-4" />
              Anterior
            </button>
            <button
              type="button"
              :disabled="selectedStage === PROCESS.length - 1"
              class="inline-flex items-center gap-1.5 text-[0.75rem] font-semibold text-accent transition-colors hover:text-teal disabled:cursor-not-allowed disabled:opacity-40"
              @click="nextStage"
            >
              Siguiente
              <ChevronRight class="h-4 w-4" />
            </button>
          </div>
        </section>
      </div>
    </Teleport>
  </section>
</template>
