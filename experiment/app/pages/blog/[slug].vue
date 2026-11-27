<script setup lang="ts">
import { ArrowLeft, ArrowRight, CalendarDays, Check, Clock, Quote } from '@lucide/vue'
import { cn } from '~/utils/cn'
import type { Post } from '~/types/content.types'

const route = useRoute()
const slug = computed(() => String(route.params.slug ?? ''))
const { data: post } = await useFetch<Post>(() => `/api/posts/${slug.value}`)

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Artículo no encontrado' })
}

useSeoMeta({
  title: () => `${post.value?.title ?? 'Artículo'} · CCIP Blog`,
  description: () => post.value?.excerpt ?? '',
})

const categoryStyles: Record<string, string> = {
  telecom: 'border-accent/25 bg-accent/[0.08] text-accent',
  security: 'border-teal/25 bg-teal/[0.08] text-teal',
  energy: 'border-line-strong bg-surface-2 text-muted',
}
</script>

<template>
  <article v-if="post" class="bg-bg pt-[7rem] pb-16 sm:pt-[8rem] lg:pb-24">
    <div class="container-x">
      <NuxtLink to="/blog" class="link-arrow mb-7 inline-flex">
        <ArrowLeft class="h-3.5 w-3.5" />
        Volver al blog
      </NuxtLink>

      <header
        class="relative overflow-hidden rounded-[1.6rem] border border-line bg-gradient-to-br from-accent/12 via-teal/[0.07] to-transparent px-5 py-8 sm:px-9 sm:py-12"
      >
        <div
          class="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full border border-accent/15"
        />
        <div
          class="pointer-events-none absolute -right-8 -top-10 h-36 w-36 rounded-full border border-teal/20"
        />
        <span
          :class="
            cn(
              'relative rounded-full border px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.12em]',
              categoryStyles[post.categoryIcon],
            )
          "
        >
          {{ post.category }}
        </span>
        <h1
          class="relative mt-5 max-w-[26ch] text-[2rem] font-[700] leading-[1.1] tracking-[-0.045em] text-ink sm:text-[3rem]"
        >
          {{ post.title }}
        </h1>
        <div
          class="relative mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.72rem] text-muted"
        >
          <span class="inline-flex items-center gap-1.5">
            <CalendarDays class="h-3.5 w-3.5" />
            {{ post.date }}
          </span>
          <span class="inline-flex items-center gap-1.5">
            <Clock class="h-3.5 w-3.5" />
            {{ post.readTime }}
          </span>
          <span class="inline-flex items-center gap-1.5">
            <span class="h-1.5 w-1.5 rounded-full bg-teal" />
            Equipo de ingeniería CCIP
          </span>
        </div>
      </header>

      <div class="article-body mx-auto mt-10 max-w-[760px] px-1 sm:px-5">
        <div class="mb-7 flex gap-3 rounded-xl border border-line bg-surface-2/60 p-4">
          <Quote class="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          <p class="!mb-0 !text-[0.85rem] !italic !leading-relaxed !text-muted">
            {{ post.excerpt }}
          </p>
        </div>

        <div v-for="(block, i) in post.body" :key="i">
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
          class="mt-9 flex flex-col gap-3 rounded-2xl border border-accent/20 bg-accent/[0.06] p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p class="text-[0.9rem] font-semibold tracking-[-0.02em] text-ink">
              ¿Quiere revisar su infraestructura actual?
            </p>
            <p class="mt-1 text-[0.75rem] text-muted">
              Conversemos sobre las necesidades de su infraestructura.
            </p>
          </div>
          <NuxtLink to="/#contacto" class="btn btn-primary h-10 shrink-0 px-4 text-[0.78rem]">
            Cotizar una solución
            <ArrowRight class="h-3.5 w-3.5" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </article>
</template>
