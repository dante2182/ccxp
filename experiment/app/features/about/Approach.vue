<script setup lang="ts">
import { Activity, ArrowRight, Check, MapPin, Phone, Sparkles } from '@lucide/vue'
import { CAPABILITIES, CONTACT } from '~/data/content'
import { capabilityIcons } from '~/utils/icons'
import { cn } from '~/utils/cn'
import type { Capability } from '~/types/content.types'

defineEmits<{ quote: [service?: string] }>()

const capabilityToService: Record<string, string> = {
  fibra: 'Telecomunicaciones',
  '5g': 'Telecomunicaciones',
  seguridad: 'Seguridad electrónica',
  energia: 'Energía eléctrica',
}

const activeId = ref(CAPABILITIES[0]!.id)
const active = computed<Capability>(
  () => CAPABILITIES.find((c) => c.id === activeId.value) ?? CAPABILITIES[0]!,
)
const activeIndex = computed(() => CAPABILITIES.findIndex((c) => c.id === active.value.id))
</script>

<template>
  <section
    id="capacidades"
    class="relative overflow-hidden border-y border-line bg-bg-deep/45 pt-5 pb-8 sm:pt-8 sm:pb-12 lg:pt-10 lg:pb-16"
  >
    <div
      class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_40%_at_82%_12%,var(--glow-a),transparent_70%)] opacity-60"
    />
    <div class="container-x">
      <BaseReveal class="flex flex-col items-center text-center">
        <div class="eyebrow">
          <span
            class="h-1.5 w-1.5 rounded-full bg-teal shadow-[0_0_10px_2px_color-mix(in_oklab,var(--accent)_35%,transparent)]"
          />
          Capacidades
        </div>
        <h2
          class="mt-5 max-w-[22ch] text-[2.15rem] font-[700] leading-[1.03] tracking-[-0.048em] text-ink sm:text-[2.9rem] lg:text-[3.4rem]"
        >
          Cada capa de la red, <span class="gradient-text">resuelta con precisión.</span>
        </h2>
      </BaseReveal>

      <BaseReveal :delay="80">
        <div
          class="mt-10 grid grid-cols-2 gap-1.5 rounded-2xl border border-line bg-surface/60 p-1.5 backdrop-blur-md sm:grid-cols-4"
        >
          <button
            v-for="cap in CAPABILITIES"
            :key="cap.id"
            type="button"
            :aria-pressed="activeId === cap.id"
            :class="
              cn(
                'group/tab relative flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-[0.78rem] font-semibold transition-all duration-300 sm:px-4',
                activeId === cap.id
                  ? 'bg-surface text-ink shadow-[0_4px_18px_-6px_rgba(2,12,27,0.4)] ring-1 ring-line'
                  : 'text-muted hover:-translate-y-0.5 hover:bg-surface/75 hover:text-ink hover:shadow-[0_8px_18px_-12px_rgba(10,31,68,0.45)]',
              )
            "
            @click="activeId = cap.id"
          >
            <component
              :is="capabilityIcons[cap.id] ?? Activity"
              :class="
                cn(
                  'h-3.5 w-3.5 transition-transform duration-300 group-hover/tab:scale-110',
                  activeId === cap.id ? 'text-accent' : 'text-muted/70',
                )
              "
              :stroke-width="2"
            />
            {{ cap.label }}
          </button>
        </div>
      </BaseReveal>

      <div class="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-stretch">
        <BaseReveal class="h-full">
          <div
            class="group relative h-full min-h-[250px] overflow-hidden rounded-3xl border border-line bg-surface-2 sm:min-h-[320px] lg:min-h-[340px]"
          >
            <img
              :key="active.image"
              :src="active.image"
              :alt="active.imageAlt"
              loading="lazy"
              class="absolute inset-0 h-full w-full animate-rise object-cover transition-transform duration-[1400ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-[#020a13]/85 via-[#020a13]/15 to-transparent"
            />
            <div class="absolute inset-x-0 top-0 flex items-start justify-between p-4 sm:p-5">
              <span
                class="rounded-full border border-white/20 bg-black/25 px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-white/90 backdrop-blur-md"
              >
                {{ active.eyebrow }}
              </span>
              <span
                class="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/25 px-2.5 py-1.5 text-[0.6rem] font-medium text-white/80 backdrop-blur-md"
              >
                <span class="pulse-dot h-1.5 w-1.5 rounded-full bg-teal" />
                Proyecto verificado
              </span>
            </div>
            <div
              class="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-6"
            >
              <div>
                <p class="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-teal">
                  Capacidad 0{{ activeIndex + 1 }}
                </p>
                <p class="mt-1 text-[0.92rem] font-medium text-white sm:text-[1.02rem]">
                  {{ active.label }}
                </p>
              </div>
              <div
                class="hidden items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[0.62rem] text-white/90 backdrop-blur-md sm:flex"
              >
                <MapPin class="h-3 w-3" />
                Arequipa, Perú
              </div>
            </div>
          </div>
        </BaseReveal>

        <BaseReveal :delay="120" class="h-full">
          <div :key="active.id" class="panel animate-rise flex h-full flex-col p-4 sm:p-5">
            <span class="eyebrow">{{ active.eyebrow }}</span>
            <h3
              class="mt-1.5 text-[1.25rem] font-[680] leading-[1.12] tracking-[-0.04em] text-ink sm:text-[1.45rem]"
            >
              {{ active.title }}
            </h3>
            <p class="mt-1.5 text-[0.76rem] leading-[1.55] text-muted">{{ active.description }}</p>

            <ul class="mt-3 flex flex-col gap-1.5">
              <li
                v-for="bullet in active.bullets"
                :key="bullet"
                class="flex items-start gap-2 text-[0.75rem] leading-tight text-muted"
              >
                <span
                  class="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-teal/12 text-teal"
                >
                  <Check class="h-2.5 w-2.5" :stroke-width="3" />
                </span>
                {{ bullet }}
              </li>
            </ul>

            <div class="mt-auto grid grid-cols-3 gap-2 border-t border-line pt-3 sm:mt-3">
              <div v-for="metric in active.metrics" :key="metric.label">
                <p
                  class="tabular text-[1.05rem] font-[700] tracking-[-0.03em] text-ink sm:text-[1.2rem]"
                >
                  {{ metric.value }}
                </p>
                <p class="mt-1 text-[0.6rem] leading-tight text-muted/85">{{ metric.label }}</p>
              </div>
            </div>

            <button
              type="button"
              class="link-arrow mt-3 w-fit"
              @click="$emit('quote', capabilityToService[active.id])"
            >
              Solicitar evaluación técnica
              <ArrowRight class="h-3.5 w-3.5" :stroke-width="2" />
            </button>
          </div>
        </BaseReveal>
      </div>

      <div class="mt-8 grid gap-5 sm:mt-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-stretch">
        <div class="flex flex-col gap-4">
          <BaseReveal :delay="60">
            <div class="panel flex flex-col gap-3 p-5 sm:p-6">
              <div class="eyebrow">
                <Sparkles class="h-3.5 w-3.5 text-accent" />
                Ingeniería aplicada
              </div>
              <p
                class="text-[0.98rem] font-semibold leading-[1.4] tracking-[-0.02em] text-ink sm:text-[1.08rem]"
              >
                No ensamblamos equipos: diseñamos infraestructura.
              </p>
              <p class="text-[0.76rem] leading-[1.65] text-muted sm:text-[0.8rem]">
                Explore las capacidades técnicas que nuestro equipo ejecuta en campo, con
                documentación, certificación y soporte posterior.
              </p>
              <div class="mt-1 flex flex-wrap items-center gap-2">
                <span class="chip">
                  <span class="pulse-dot h-1.5 w-1.5 rounded-full bg-teal" />
                  NOC con monitoreo 24/7
                </span>
                <span class="chip">
                  <MapPin class="h-3 w-3 text-accent" />
                  Arequipa, Perú
                </span>
              </div>
            </div>
          </BaseReveal>

          <BaseReveal :delay="120">
            <div
              class="flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface/40 px-5 py-4"
            >
              <div>
                <p class="text-[0.72rem] font-semibold text-ink">¿Emergencia operativa?</p>
                <p class="mt-0.5 text-[0.66rem] text-muted">Atención técnica prioritaria 24/7</p>
              </div>
              <a
                :href="`tel:${CONTACT.phoneHref}`"
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-orange/30 bg-orange/10 text-orange transition-transform hover:scale-105"
                aria-label="Llamar a soporte técnico"
              >
                <Phone class="h-4 w-4" />
              </a>
            </div>
          </BaseReveal>
        </div>

        <BaseReveal :delay="180" class="h-full">
          <div class="relative h-full min-h-[430px] overflow-hidden rounded-3xl border border-line">
            <img
              src="https://images.pexels.com/photos/17489163/pexels-photo-17489163.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1800"
              alt="Sala de servidores del centro de operaciones de red"
              loading="lazy"
              class="absolute inset-0 h-full w-full object-cover"
            />
            <div
              class="absolute inset-0 bg-gradient-to-r from-[#020a15] via-[#020a15]/90 to-[#020a15]/25"
            />
            <div
              class="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,10,21,0.35),transparent_40%)]"
            />
            <div class="relative z-10 flex h-full flex-col justify-between gap-6 p-6 sm:p-8">
              <div class="max-w-[580px]">
                <div
                  class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 backdrop-blur-md"
                >
                  <span class="pulse-dot h-1.5 w-1.5 rounded-full bg-teal" />
                  <span
                    class="text-[0.6rem] font-semibold uppercase tracking-[0.17em] text-white/85"
                  >
                    Centro de operaciones · CCIP
                  </span>
                </div>
                <h3
                  class="mt-4 text-[1.85rem] font-[700] leading-[1.08] tracking-[-0.045em] text-white sm:text-[2.3rem]"
                >
                  Su red, monitoreada las 24 horas.
                </h3>
                <p
                  class="mt-3 max-w-[48ch] text-[0.86rem] leading-[1.7] text-white/70 sm:text-[0.92rem]"
                >
                  Nuestro equipo de soporte detecta y atiende incidencias antes de que afecten su
                  operación. Cada evento queda registrado en un historial técnico auditable.
                </p>
                <div class="mt-5 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    class="btn btn-accent group h-11 px-5"
                    @click="$emit('quote')"
                  >
                    Conocer el soporte
                    <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                  <a
                    href="#contacto"
                    class="btn h-11 border border-white/20 bg-white/[0.06] px-5 text-white backdrop-blur-md hover:bg-white/[0.12]"
                  >
                    Hablar con un ingeniero
                  </a>
                </div>
              </div>
              <div class="grid grid-cols-3 gap-3 border-t border-white/15 pt-5 sm:gap-6">
                <div
                  v-for="m in [
                    { v: '24/7', l: 'Monitoreo continuo' },
                    { v: '< 4 h', l: 'Respuesta en campo' },
                    { v: '0', l: 'Incidencias abiertas' },
                  ]"
                  :key="m.l"
                >
                  <p
                    class="tabular text-[1.35rem] font-[700] tracking-[-0.04em] text-white sm:text-[1.6rem]"
                  >
                    {{ m.v }}
                  </p>
                  <p
                    class="mt-1 text-[0.58rem] uppercase leading-tight tracking-[0.1em] text-white/55"
                  >
                    {{ m.l }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </BaseReveal>
      </div>
    </div>
  </section>
</template>
