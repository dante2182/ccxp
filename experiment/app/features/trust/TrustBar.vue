<script setup lang="ts">
import { STATS, TRUST_CLIENTS } from '~/data/content'
import { sectorIcons } from '~/utils/icons'
</script>

<template>
  <section aria-label="Experiencia y sectores" class="relative border-y border-line bg-surface/35">
    <div class="group relative flex items-center gap-4 overflow-hidden border-b border-line py-4">
      <div
        class="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-bg to-transparent"
      />
      <div
        class="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-bg to-transparent"
      />
      <div class="flex w-max animate-marquee items-center">
        <div v-for="copy in [0, 1]" :key="copy" class="flex shrink-0 items-center">
          <span
            class="mr-8 hidden whitespace-nowrap pl-8 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-muted/70 sm:block"
          >
            Experiencia comprobada en
          </span>
          <div
            v-for="(client, i) in TRUST_CLIENTS"
            :key="`${copy}-${client}`"
            class="flex items-center gap-2.5 px-6"
          >
            <component
              :is="sectorIcons[i % sectorIcons.length]"
              class="h-3.5 w-3.5 text-accent/70"
              :stroke-width="1.7"
            />
            <span class="whitespace-nowrap text-[0.78rem] font-medium text-muted">{{
              client
            }}</span>
            <span class="ml-4 h-1 w-1 rounded-full bg-line-strong" />
          </div>
        </div>
      </div>
    </div>

    <div
      class="container-x grid grid-cols-2 gap-y-8 py-9 sm:grid-cols-4 sm:divide-x sm:divide-line"
    >
      <BaseReveal
        v-for="(stat, i) in STATS"
        :key="stat.label"
        :delay="i * 80"
        class="px-1 sm:px-6 sm:first:pl-0 sm:last:pr-0"
      >
        <div class="flex items-baseline gap-2">
          <span
            class="tabular text-[1.9rem] font-[700] leading-none tracking-[-0.05em] text-ink sm:text-[2.2rem]"
          >
            {{ stat.value }}
          </span>
          <span class="h-1.5 w-1.5 rounded-full bg-teal/70" />
        </div>
        <p class="mt-2 text-[0.75rem] font-medium text-muted">{{ stat.label }}</p>
        <p class="mt-0.5 text-[0.64rem] uppercase tracking-[0.1em] text-muted/60">
          {{ stat.detail }}
        </p>
      </BaseReveal>
    </div>
  </section>
</template>
