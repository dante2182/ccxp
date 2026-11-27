<script setup lang="ts">
import { CheckCircle2, Sparkles } from '@lucide/vue'
</script>

<template>
  <BaseReveal :delay="180">
    <div
      class="relative overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/[0.1] via-teal/[0.05] to-transparent p-5"
    >
      <div
        class="pointer-events-none absolute -right-6 -top-8 h-28 w-28 rounded-full bg-accent/10 blur-2xl"
      />
      <div class="relative flex items-center gap-2">
        <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/12 text-accent">
          <Sparkles class="h-3.5 w-3.5" />
        </span>
        <p class="text-[0.85rem] font-semibold tracking-[-0.02em] text-ink">
          Coordinación de proyectos
        </p>
      </div>
      <p class="relative mt-2.5 text-[0.76rem] leading-[1.7] text-muted">
        Compártanos el alcance de su requerimiento; el equipo de CCIP se pondrá en contacto para
        coordinar la atención según el servicio que necesita.
      </p>
      <div class="relative mt-3 flex items-center gap-1.5 text-[0.66rem] font-medium text-teal">
        <CheckCircle2 class="h-3.5 w-3.5" />
        Seguimiento por el equipo de CCIP
      </div>
    </div>
  </BaseReveal>
</template>
