<script setup lang="ts">
import { ArrowDown, ArrowRight, Server, ShieldCheck, Sparkles, TrendingUp } from '@lucide/vue'
import { useHeroVisibility } from '~/composables/useHeroVisibility'
import type { Theme } from '~/types/content.types'

defineProps<{ theme: Theme }>()
defineEmits<{ quote: [] }>()

const sectionRef = shallowRef<HTMLElement | null>(null)
const setSection = (el: unknown) => {
  sectionRef.value = el as HTMLElement | null
}
const { showMobileActions } = useHeroVisibility(sectionRef)
</script>

<template>
  <section
    id="inicio"
    :ref="setSection"
    class="relative isolate min-h-[100svh] overflow-hidden pb-16 pt-[5.6rem] sm:pb-20 lg:pt-[6.5rem]"
  >
    <div
      class="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b"
      :class="theme === 'dark' ? 'from-bg via-bg to-bg-deep' : 'from-white via-white to-[#EAF1FA]'"
    />
    <div class="hero-glow pointer-events-none absolute inset-0 -z-10" />
    <div
      class="pointer-events-none absolute inset-0 -z-10"
      :class="
        theme === 'dark'
          ? 'bg-[radial-gradient(ellipse_at_50%_-20%,color-mix(in_oklab,var(--accent)_10%,transparent),transparent_60%)]'
          : 'bg-[radial-gradient(ellipse_at_74%_40%,rgba(234,241,250,0.42),transparent_58%)]'
      "
    />
    <div
      class="dot-grid pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_65%_60%_at_30%_35%,#000,transparent_78%)]"
      :class="theme === 'dark' ? 'opacity-[0.32]' : 'opacity-[0.18]'"
    />
    <div
      class="pointer-events-none absolute -right-24 top-[16%] -z-10 h-[420px] w-[420px] animate-drift rounded-full blur-[100px]"
      :class="theme === 'dark' ? 'bg-accent/10' : 'bg-[#DCE6F3]/55'"
    />
    <div
      class="pointer-events-none absolute -left-32 bottom-[6%] -z-10 h-[380px] w-[380px] animate-drift rounded-full blur-[110px] [animation-delay:-6s]"
      :class="theme === 'dark' ? 'bg-teal/[0.07]' : 'bg-[#EAF1FA]/55'"
    />

    <div
      class="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b lg:hidden"
      :class="
        theme === 'dark'
          ? 'from-bg/80 via-bg/25 to-bg/85'
          : 'from-white/85 via-white/40 to-[#EAF1FA]/90'
      "
    />

    <div class="absolute inset-0 z-5 h-full w-full">
      <PlanetScene :theme="theme" class="pointer-events-auto" />
    </div>

    <div
      class="container-x pointer-events-none relative z-10 flex min-h-[calc(100svh-10rem)] flex-col justify-start pt-4 lg:justify-center lg:pt-0"
    >
      <div class="relative z-10 lg:grid lg:grid-cols-2 lg:items-center">
        <div class="pointer-events-none">
          <div>
            <BaseReveal :delay="40">
              <div
                class="inline-flex items-center gap-2.5 rounded-full border border-line-strong bg-surface/40 py-1.5 pl-2.5 pr-4 backdrop-blur-xl"
              >
                <span
                  class="flex h-6 w-6 items-center justify-center rounded-full bg-accent/12 text-accent"
                >
                  <Sparkles class="h-3.5 w-3.5" :stroke-width="1.9" />
                </span>
                <span
                  class="text-[0.7rem] font-medium tracking-[0.005em] text-muted sm:text-[0.76rem]"
                >
                  Ingeniería y Telecomunicaciones desde 2014
                </span>
              </div>
            </BaseReveal>

            <BaseReveal :delay="120">
              <h1
                class="mt-6 max-w-[19ch] text-[2.4rem] font-[700] leading-[1.04] tracking-[-0.045em] text-ink sm:text-[3.4rem] lg:text-[3.9rem] xl:text-[4.15rem]"
              >
                Conectividad e
                <span
                  :class="
                    theme === 'dark'
                      ? 'gradient-text'
                      : 'bg-gradient-to-r from-[#174EA6] to-[#3975C6] bg-clip-text text-transparent'
                  "
                  >infraestructura</span
                >
                para impulsar su empresa
              </h1>
              <div class="mt-4 flex items-center gap-2">
                <span
                  class="rounded-full border border-line bg-surface/50 px-3 py-1.5 backdrop-blur-xl text-[0.66rem] uppercase tracking-[0.16em] text-ink/80"
                >
                  Arequipa · Nodo sur
                </span>
                <span
                  class="pulse-dot h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_2px_color-mix(in_oklab,var(--accent)_35%,transparent)]"
                />
                <span class="h-px w-10 bg-gradient-to-l from-transparent to-accent/60" />
              </div>
            </BaseReveal>

            <BaseReveal :delay="210">
              <p
                class="mt-6 max-w-[590px] text-[0.95rem] leading-[1.72] text-muted sm:text-[1.03rem]"
              >
                Diseñamos redes, seguridad electrónica y sistemas eléctricos para empresas de
                Arequipa y todo el Perú.
              </p>
            </BaseReveal>

            <BaseReveal :delay="290" class="hidden lg:block">
              <div class="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  class="btn btn-primary group pointer-events-auto h-12 px-6 text-[0.9rem]"
                  @click="$emit('quote')"
                >
                  Solicitar Cotización
                  <ArrowRight
                    class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>
                <a
                  href="#servicios"
                  class="btn btn-ghost group pointer-events-auto h-12 px-6 text-[0.9rem]"
                >
                  Explorar Servicios
                  <ArrowDown
                    class="h-4 w-4 text-accent transition-transform duration-300 group-hover:translate-y-0.5"
                  />
                </a>
              </div>
            </BaseReveal>
          </div>
        </div>
      </div>

      <div class="pointer-events-none absolute bottom-[9%] right-[3.5rem] z-20 hidden xl:block">
        <div
          class="animate-floaty-slow w-[268px] rounded-2xl border p-4"
          :class="
            theme === 'dark'
              ? 'border-line-strong bg-glass backdrop-blur-2xl shadow-[0_30px_70px_-34px_rgba(2,12,27,0.85)]'
              : 'border-[#DCE6F3] bg-white/95 backdrop-blur-md shadow-[0_16px_42px_-30px_rgba(11,31,66,0.24)]'
          "
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span
                class="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/12 text-accent"
              >
                <Server class="h-3.5 w-3.5" :stroke-width="2" />
              </span>
              <div>
                <p class="text-[0.66rem] font-semibold tracking-[0.12em] text-muted uppercase">
                  Servicios entregados
                </p>
                <p class="text-[0.66rem] text-muted/80">Crecimiento mensual sostenido</p>
              </div>
            </div>
            <span
              class="flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/10 px-2 py-1 text-[0.58rem] font-semibold text-accent"
            >
              <TrendingUp class="h-3.5 w-3.5" />
              +12%
            </span>
          </div>
          <div class="mt-3.5 flex items-end justify-between">
            <div>
              <p class="tabular text-[1.85rem] font-[700] leading-none tracking-[-0.04em] text-ink">
                +12%
              </p>
              <p class="mt-1 text-[0.62rem] text-muted">
                Crecimiento mensual · servicios con éxito
              </p>
            </div>
            <svg viewBox="0 0 110 38" class="h-9 w-[104px]" aria-hidden="true">
              <defs>
                <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    :stop-color="theme === 'dark' ? 'var(--accent)' : '#174EA6'"
                    stop-opacity="0.4"
                  />
                  <stop
                    offset="100%"
                    :stop-color="theme === 'dark' ? 'var(--accent)' : '#174EA6'"
                    stop-opacity="0"
                  />
                </linearGradient>
              </defs>
              <path
                d="M2 30 L14 26 L24 29 L34 18 L45 22 L56 12 L68 16 L78 8 L89 13 L100 5 L108 8 L108 38 L2 38 Z"
                fill="url(#spark)"
              />
              <path
                d="M2 30 L14 26 L24 29 L34 18 L45 22 L56 12 L68 16 L78 8 L89 13 L100 5 L108 8"
                fill="none"
                :stroke="theme === 'dark' ? 'var(--accent)' : '#174EA6'"
                stroke-width="1.6"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div class="mt-3.5 grid grid-cols-3 gap-2 border-t border-line pt-3">
            <div
              v-for="m in [
                { k: 'Telecom', v: '98%' },
                { k: 'Seguridad', v: '95%' },
                { k: 'Energía', v: '99%' },
              ]"
              :key="m.k"
            >
              <p class="text-[0.56rem] uppercase tracking-wider text-muted/80">{{ m.k }}</p>
              <p class="tabular mt-0.5 text-[0.74rem] font-semibold text-ink">{{ m.v }}</p>
            </div>
          </div>
        </div>
        <div
          class="mt-3 ml-auto flex w-fit items-center gap-2 rounded-full border border-line bg-glass px-3 py-1.5 backdrop-blur-xl"
        >
          <ShieldCheck
            class="h-3.5 w-3.5"
            :class="theme === 'dark' ? 'text-teal' : 'text-[#3975C6]'"
            :stroke-width="2"
          />
          <span class="text-[0.62rem] font-medium text-muted">Entregas certificadas</span>
        </div>
      </div>
    </div>

    <div
      class="container-x pointer-events-none relative z-10 mt-6 hidden items-center justify-between sm:flex lg:mt-7"
    >
      <a
        href="#servicios"
        class="group pointer-events-auto inline-flex items-center gap-2.5 text-[0.66rem] font-medium uppercase tracking-[0.18em] text-muted transition-colors hover:text-ink"
      >
        <span
          class="flex h-7 w-4 items-start justify-center rounded-full border border-line-strong p-1 transition-colors group-hover:border-accent/60"
        >
          <span class="h-1.5 w-1 animate-bounce rounded-full bg-accent" />
        </span>
        Desliza para explorar
      </a>
      <div class="flex items-center gap-3 text-[0.66rem] uppercase tracking-[0.16em] text-muted/80">
        <span class="h-px w-10 bg-line-strong" />
        Sur Perú
      </div>
    </div>

    <Teleport to="body">
      <div
        v-if="showMobileActions"
        role="group"
        aria-label="Acciones del inicio"
        class="fixed bottom-5 left-5 right-[5.5rem] z-[35] flex gap-2 lg:hidden"
      >
        <button
          type="button"
          aria-label="Solicitar cotización"
          class="btn btn-primary group h-11 min-w-0 flex-1 gap-1 px-2 text-[0.68rem] sm:h-12 sm:px-4 sm:text-sm"
          @click="$emit('quote')"
        >
          <span class="sm:hidden">Solicitar</span>
          <span class="hidden sm:inline">Solicitar cotización</span>
          <ArrowRight
            class="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
          />
        </button>
        <a
          href="#servicios"
          aria-label="Explorar servicios"
          class="btn btn-ghost group h-11 min-w-0 flex-1 gap-1 px-2 text-[0.68rem] sm:h-12 sm:px-4 sm:text-sm"
        >
          <span class="sm:hidden">Explorar</span>
          <span class="hidden sm:inline">Explorar servicios</span>
          <ArrowDown
            class="h-3.5 w-3.5 shrink-0 text-accent transition-transform duration-300 group-hover:translate-y-0.5"
          />
        </a>
      </div>
    </Teleport>
  </section>
</template>
