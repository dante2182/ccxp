<script setup lang="ts">
import { ArrowRight, Menu, MessageCircle, X } from '@lucide/vue'
import { cn } from '~/utils/cn'
import { CONTACT } from '~/data/content'
import type { Theme } from '~/types/content.types'

defineProps<{ theme: Theme }>()
defineEmits<{ toggleTheme: []; quote: [] }>()

const LINKS = [
  { label: 'Inicio', href: '#inicio', id: 'inicio' },
  { label: 'Servicios', href: '#servicios', id: 'servicios' },
  { label: 'Capacidades', href: '#capacidades', id: 'capacidades' },
  { label: 'Nosotros', href: '#nosotros', id: 'nosotros' },
  { label: 'Blog', href: '#blog', id: 'blog' },
  { label: 'Contáctenos', href: '#contacto', id: 'contacto' },
]

const scrolled = ref(false)
const progress = ref(0)
const active = ref('inicio')
const open = ref(false)

let raf = 0
const update = () => {
  raf = 0
  const y = window.scrollY
  scrolled.value = y > 24
  const height = document.documentElement.scrollHeight - window.innerHeight
  progress.value = height > 0 ? Math.min(1, y / height) : 0

  let current = 'inicio'
  LINKS.forEach((link) => {
    const node = document.getElementById(link.id)
    if (node && node.getBoundingClientRect().top <= window.innerHeight * 0.32) current = link.id
  })
  active.value = current
}
const onScroll = () => {
  if (!raf) raf = requestAnimationFrame(update)
}

onMounted(() => {
  update()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  if (raf) cancelAnimationFrame(raf)
})

let previousOverflow = ''
let onKey: ((event: KeyboardEvent) => void) | undefined
watch(open, (isOpen) => {
  if (!isOpen) {
    if (onKey) window.removeEventListener('keydown', onKey)
    document.body.style.overflow = previousOverflow
    onKey = undefined
    return
  }
  previousOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') open.value = false
  }
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  if (onKey) window.removeEventListener('keydown', onKey)
  if (open.value) document.body.style.overflow = previousOverflow
})
</script>

<template>
  <header
    :class="
      cn(
        'fixed inset-x-0 top-0 z-50 bg-bg',
        scrolled
          ? 'border-b border-line shadow-[0_10px_40px_-24px_rgba(2,12,27,0.5)]'
          : 'border-b border-transparent',
      )
    "
  >
    <div
      v-if="scrolled"
      class="pointer-events-none absolute inset-0 -z-10 backdrop-blur-2xl backdrop-saturate-150"
    />
    <div class="container-x flex h-[4.4rem] items-center justify-between gap-4 lg:h-[4.75rem]">
      <a href="#inicio" aria-label="CCIP inicio" class="shrink-0">
        <BrandLogo />
      </a>

      <nav class="hidden items-center gap-0.5 lg:flex" aria-label="Navegación principal">
        <a
          v-for="link in LINKS"
          :key="link.id"
          :href="link.href"
          :class="
            cn(
              'group/nav relative rounded-full px-3.5 py-2 text-[0.8rem] font-medium tracking-[-0.01em] transition-colors duration-200',
              active === link.id ? 'text-ink' : 'text-muted hover:text-ink',
            )
          "
        >
          {{ link.label }}
          <span
            :class="
              cn(
                'absolute inset-x-3.5 -bottom-[1px] h-[2px] origin-center scale-x-0 rounded-full bg-gradient-to-r from-accent to-teal transition-all duration-300 group-hover/nav:scale-x-100',
                active === link.id
                  ? 'scale-x-100 opacity-100'
                  : 'opacity-0 group-hover/nav:opacity-100',
              )
            "
          />
        </a>
      </nav>

      <div class="flex items-center gap-2 sm:gap-3">
        <ThemeToggle :theme="theme" @toggle="$emit('toggleTheme')" />
        <a href="#contacto" class="btn btn-primary hidden sm:inline-flex">
          Contáctenos
          <ArrowRight class="h-4 w-4" :stroke-width="2" />
        </a>
        <button
          type="button"
          :aria-label="open ? 'Cerrar menú' : 'Abrir menú'"
          :aria-expanded="open"
          class="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line-strong bg-surface/50 text-ink lg:hidden"
          @click="open = !open"
        >
          <X v-if="open" class="h-5 w-5" />
          <Menu v-else class="h-5 w-5" />
        </button>
      </div>
    </div>
    <div class="absolute inset-x-0 bottom-0 h-[1.5px] overflow-hidden">
      <div
        class="h-full origin-left bg-gradient-to-r from-accent via-teal to-accent-strong transition-transform duration-150"
        :style="{ transform: `scaleX(${progress})` }"
      />
    </div>
  </header>

  <div
    :class="
      cn('fixed inset-0 z-40 lg:hidden', open ? 'pointer-events-auto' : 'pointer-events-none')
    "
    :aria-hidden="!open"
  >
    <div
      :class="
        cn(
          'absolute inset-0 bg-[#02060e]/55 backdrop-blur-sm transition-opacity duration-300',
          open ? 'opacity-100' : 'opacity-0',
        )
      "
      @click="open = false"
    />
    <div
      :class="
        cn(
          'absolute inset-x-3 top-[4.9rem] overflow-hidden rounded-2xl border border-line bg-surface/95 p-3 shadow-2xl backdrop-blur-2xl transition-all duration-400 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]',
          open ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0',
        )
      "
    >
      <nav class="flex flex-col" aria-label="Navegación móvil">
        <a
          v-for="(link, i) in LINKS"
          :key="link.id"
          :href="link.href"
          :class="
            cn(
              'flex items-center justify-between rounded-xl px-4 py-3.5 text-[0.95rem] font-medium transition-colors',
              active === link.id
                ? 'bg-surface-2 text-ink'
                : 'text-muted hover:bg-surface-2 hover:text-ink',
            )
          "
          :style="{ transitionDelay: `${i * 20}ms` }"
          @click="open = false"
        >
          {{ link.label }}
          <ArrowRight class="h-4 w-4 opacity-40" />
        </a>
      </nav>
      <div class="mt-2 grid gap-2 border-t border-line p-1 pt-3">
        <a href="#contacto" class="btn btn-primary w-full" @click="open = false">
          Contáctenos
          <ArrowRight class="h-4 w-4" />
        </a>
        <a
          :href="CONTACT.whatsapp"
          target="_blank"
          rel="noreferrer"
          class="btn btn-ghost w-full"
          @click="open = false"
        >
          <MessageCircle class="h-4 w-4 text-emerald-500" />
          Escribir por WhatsApp
        </a>
      </div>
    </div>
  </div>
</template>
