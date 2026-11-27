<script setup lang="ts">
import { ArrowRight, CalendarDays, Check, Clock, Quote, X } from '@lucide/vue'
import { cn } from '~/utils/cn'
import { useContent } from '~/composables/useContent'
import { useDialog } from '~/composables/useDialog'
import type { Post } from '~/types/content.types'

const emit = defineEmits<{ quote: [] }>()
const { posts } = useContent()
const POSTS = computed(() => posts.value.filter((post) => post.featured))

const categoryStyles: Record<string, string> = {
  telecom: 'border-accent/25 bg-accent/[0.08] text-accent',
  security: 'border-teal/25 bg-teal/[0.08] text-teal',
  energy: 'border-line-strong bg-surface-2 text-muted',
}

const openPost = ref<Post | null>(null)
const close = () => {
  openPost.value = null
}
const isOpen = computed(() => openPost.value !== null)

useDialog(isOpen, close, undefined, false)

const quoteFromPost = () => {
  openPost.value = null
  emit('quote')
}
</script>

<template>
  <section id="blog" class="relative overflow-hidden pt-5 pb-8 sm:pt-8 sm:pb-12 lg:pt-10 lg:pb-16">
    <div
      class="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(50%_60%_at_50%_0%,var(--glow-a),transparent_75%)] opacity-55"
    />
    <div class="container-x">
      <BaseReveal>
        <SectionHeading
          eyebrow="Blog"
          description="Tendencias y buenas prácticas en telecomunicaciones, seguridad y energía, escritas por nuestro equipo de ingeniería."
        >
          <template #title
            >Conocimiento técnico <span class="gradient-text">reciente</span></template
          >
        </SectionHeading>
      </BaseReveal>

      <div class="mt-11 grid gap-4 lg:grid-cols-3 lg:gap-5">
        <BaseReveal
          v-for="(post, index) in POSTS"
          :key="post.id"
          :delay="index * 100"
          class="h-full"
        >
          <BlogCard :post="post" @open="openPost = $event" />
        </BaseReveal>
      </div>

      <BaseReveal :delay="80">
        <div class="mt-9 flex flex-col items-center justify-center gap-2 text-center">
          <p class="text-[0.75rem] text-muted">
            ¿Necesita aplicar estas recomendaciones en su infraestructura?
          </p>
          <button type="button" class="link-arrow" @click="emit('quote')">
            Solicitar evaluación técnica
            <ArrowRight class="h-3.5 w-3.5" />
          </button>
          <NuxtLink to="/blog" class="link-arrow">
            Ver más
            <ArrowRight class="h-3.5 w-3.5" />
          </NuxtLink>
        </div>
      </BaseReveal>
    </div>

    <Teleport to="body">
      <div v-if="openPost" class="fixed inset-0 z-[100] overflow-y-auto">
        <div
          class="modal-backdrop fixed inset-0 animate-[rise-in_0.3s_ease-out_both]"
          aria-hidden="true"
          @click="close"
        />
        <div class="relative flex min-h-full items-start justify-center p-3 py-6 sm:p-6 sm:py-10">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="article-title"
            class="animate-rise relative w-full max-w-[760px] overflow-hidden rounded-2xl border border-line bg-bg shadow-[0_40px_120px_-30px_rgba(0,0,0,0.65)]"
          >
            <div
              class="relative overflow-hidden border-b border-line bg-gradient-to-br from-accent/12 via-teal/[0.07] to-transparent px-5 pb-7 pt-6 sm:px-9 sm:pb-9 sm:pt-8"
            >
              <div
                class="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full border border-accent/15"
              />
              <div
                class="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full border border-teal/20"
              />
              <div
                class="pointer-events-none absolute right-16 top-16 h-2 w-2 rounded-full bg-accent shadow-[0_0_16px_5px_color-mix(in_oklab,var(--accent)_35%,transparent)]"
              />
              <button
                type="button"
                aria-label="Cerrar artículo"
                class="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-line-strong bg-surface/70 text-muted backdrop-blur-md transition-colors hover:bg-surface hover:text-ink sm:right-6 sm:top-6"
                @click="close"
              >
                <X class="h-4 w-4" />
              </button>
              <div class="relative">
                <span
                  :class="
                    cn(
                      'rounded-full border px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.12em]',
                      categoryStyles[openPost.categoryIcon],
                    )
                  "
                >
                  {{ openPost.category }}
                </span>
                <h2
                  id="article-title"
                  class="mt-4 max-w-[24ch] pr-8 text-[1.55rem] font-[700] leading-[1.13] tracking-[-0.04em] text-ink sm:text-[2.1rem]"
                >
                  {{ openPost.title }}
                </h2>
                <div
                  class="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.7rem] text-muted"
                >
                  <span class="inline-flex items-center gap-1.5">
                    <CalendarDays class="h-3.5 w-3.5" />
                    {{ openPost.date }}
                  </span>
                  <span class="inline-flex items-center gap-1.5">
                    <Clock class="h-3.5 w-3.5" />
                    {{ openPost.readTime }}
                  </span>
                  <span class="inline-flex items-center gap-1.5">
                    <span class="h-1.5 w-1.5 rounded-full bg-teal" />
                    Equipo de ingeniería CCIP
                  </span>
                </div>
              </div>
            </div>

            <div class="article-body px-5 py-7 sm:px-9 sm:py-8">
              <div class="mb-6 flex gap-3 rounded-xl border border-line bg-surface-2/60 p-4">
                <Quote class="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <p class="!mb-0 !text-[0.8rem] !italic !leading-relaxed !text-muted">
                  {{ openPost.excerpt }}
                </p>
              </div>

              <div v-for="(block, i) in openPost.body" :key="i">
                <h4 v-if="block.heading">{{ block.heading }}</h4>
                <p>{{ block.text }}</p>
                <ul v-if="block.list" class="mb-5">
                  <li v-for="item in block.list" :key="item">
                    <span
                      class="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-teal/12 text-teal"
                    >
                      <Check class="h-2.5 w-2.5" :stroke-width="3" />
                    </span>
                    {{ item }}
                  </li>
                </ul>
              </div>

              <div
                class="mt-8 flex flex-col gap-3 rounded-2xl border border-accent/20 bg-accent/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p class="text-[0.86rem] font-semibold tracking-[-0.02em] text-ink">
                    ¿Quiere revisar su infraestructura actual?
                  </p>
                  <p class="mt-1 text-[0.73rem] text-muted">
                    Conversemos sobre las necesidades de su infraestructura.
                  </p>
                </div>
                <button
                  type="button"
                  class="btn btn-primary h-10 shrink-0 px-4 text-[0.78rem]"
                  @click="quoteFromPost"
                >
                  Cotizar una solución
                  <ArrowRight class="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>
