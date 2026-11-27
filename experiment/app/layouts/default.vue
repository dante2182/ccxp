<script setup lang="ts">
import { MessageCircle } from '@lucide/vue'
import { useContent } from '~/composables/useContent'
import { useLanding } from '~/composables/useLanding'
import { useTheme } from '~/composables/useTheme'

const { theme, toggleTheme } = useTheme()
const { requestQuote } = useLanding()
const { site } = useContent()
</script>

<template>
  <div class="contents">
    <SiteHeader :theme="theme" @toggle-theme="toggleTheme" @quote="requestQuote()" />

    <main id="contenido">
      <slot />
    </main>

    <SiteFooter @quote="requestQuote()" />

    <a
      :href="site.contact.whatsapp"
      target="_blank"
      rel="noreferrer"
      aria-label="Escribir a CCIP por WhatsApp"
      class="group fixed bottom-5 right-5 z-30 flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full border border-emerald-400/30 bg-[#1faa53] px-3.5 text-white shadow-[0_16px_36px_-12px_rgba(31,170,83,0.65)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-[#199547] hover:shadow-[0_20px_44px_-10px_rgba(31,170,83,0.78)] sm:px-4"
    >
      <MessageCircle class="h-[19px] w-[19px] shrink-0" :stroke-width="2" />
      <span
        class="max-w-0 whitespace-nowrap text-[0.76rem] font-semibold opacity-0 transition-all duration-300 lg:group-hover:max-w-[130px] lg:group-hover:opacity-100"
      >
        Hablemos por WhatsApp
      </span>
    </a>
  </div>
</template>
