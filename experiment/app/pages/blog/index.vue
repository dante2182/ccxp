<script setup lang="ts">
import { ArrowLeft, ArrowRight } from '@lucide/vue'
import { useContent } from '~/composables/useContent'
import { cn } from '~/utils/cn'

useSeoMeta({
  title: 'Blog · CCIP | Conocimiento técnico reciente',
  description:
    'Tendencias y buenas prácticas en telecomunicaciones, seguridad electrónica, redes y energía eléctrica, escritas por el equipo de ingeniería de CCIP.',
})

const { posts, testimonials } = useContent()

const category = ref<string>('Todos')
const categories = computed(() => [
  'Todos',
  ...Array.from(new Set(posts.value.map((post) => post.category))),
])
const visiblePosts = computed(() =>
  category.value === 'Todos'
    ? posts.value
    : posts.value.filter((post) => post.category === category.value),
)
</script>

<template>
  <div class="bg-bg pt-[7rem] pb-16 sm:pt-[8rem] lg:pb-24">
    <div class="container-x">
      <BaseReveal>
        <NuxtLink to="/" class="link-arrow mb-7 inline-flex">
          <ArrowLeft class="h-3.5 w-3.5" />
          Volver al inicio
        </NuxtLink>
        <SectionHeading
          eyebrow="Blog"
          description="Todas las notas técnicas de nuestro equipo de ingeniería."
        >
          <template #title
            >Conocimiento técnico <span class="gradient-text">reciente</span></template
          >
        </SectionHeading>
      </BaseReveal>

      <BaseReveal :delay="60">
        <div class="mt-9 flex flex-wrap gap-2" aria-label="Filtrar por categoría">
          <button
            v-for="option in categories"
            :key="option"
            type="button"
            :class="
              cn(
                'rounded-full border px-3.5 py-1.5 text-[0.72rem] font-medium transition-colors',
                category === option
                  ? 'border-accent/40 bg-accent/10 text-accent'
                  : 'border-line-strong text-muted hover:border-accent/40 hover:text-ink',
              )
            "
            @click="category = option"
          >
            {{ option }}
          </button>
        </div>
      </BaseReveal>

      <div class="mt-10 grid gap-4 lg:grid-cols-3 lg:gap-5">
        <BaseReveal
          v-for="(post, index) in visiblePosts"
          :key="post.id"
          :delay="(index % 3) * 80"
          class="h-full"
        >
          <BlogCard :post="post" @open="navigateTo(`/blog/${post.slug}`)" />
        </BaseReveal>
      </div>

      <BaseReveal v-if="testimonials.length" :delay="80">
        <section class="mt-16 border-t border-line pt-12" aria-labelledby="testimonials-title">
          <h2 id="testimonials-title" class="text-[1.6rem] font-[700] tracking-[-0.04em] text-ink">
            Lo que dicen nuestros clientes
          </h2>
          <div class="mt-7 grid gap-4 lg:grid-cols-3">
            <article
              v-for="item in testimonials"
              :key="item.id"
              class="rounded-2xl border border-line bg-surface/60 p-5"
            >
              <p class="text-[0.85rem] leading-[1.7] text-muted">“{{ item.message }}”</p>
              <p class="mt-4 text-[0.8rem] font-semibold text-ink">{{ item.name }}</p>
              <p class="text-[0.7rem] text-muted/80">{{ item.role }} · {{ item.company }}</p>
            </article>
          </div>
        </section>
      </BaseReveal>

      <BaseReveal :delay="80">
        <div class="mt-14 flex justify-center">
          <NuxtLink to="/#contacto" class="btn btn-primary h-11 px-5 text-[0.82rem]">
            Solicitar evaluación técnica
            <ArrowRight class="h-4 w-4" />
          </NuxtLink>
        </div>
      </BaseReveal>
    </div>
  </div>
</template>
