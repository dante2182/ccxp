<script setup lang="ts">
import { ArrowRight, ArrowUp, Check, Mail, MapPin, MessageCircle, Phone } from '@lucide/vue'
import { CONTACT, SERVICES } from '~/data/content'
import type { LegalDocument } from '~/types/content.types'

defineEmits<{ quote: [] }>()

const email = ref('')
const subscribed = ref(false)
const legalDocument = ref<LegalDocument | null>(null)
const socialLabels = ['LinkedIn', 'Instagram', 'Facebook']

const subscribe = () => {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value)) return
  subscribed.value = true
  email.value = ''
}

const mapEmbedUrl =
  'https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d868.437318792435!2d-71.51499616891236!3d-16.42112162460173!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses-419!2spe!4v1795721643845!5m2!1ses-419!2spe'
const directionsUrl = 'https://maps.app.goo.gl/Np2FhGgMQZM7ZjiD8'
</script>

<template>
  <footer class="relative overflow-hidden border-t border-line bg-surface/25">
    <div class="container-x pt-14 sm:pt-16">
      <BaseReveal>
        <div
          class="relative overflow-hidden rounded-[1.6rem] border border-line bg-gradient-to-br from-surface via-surface-2 to-surface p-7 shadow-[var(--shadow-card)] sm:p-10 lg:p-12"
        >
          <div
            class="pointer-events-none absolute -right-20 -top-28 h-[360px] w-[360px] rounded-full border border-accent/15"
          />
          <div
            class="pointer-events-none absolute -right-6 -top-14 h-[240px] w-[240px] rounded-full border border-teal/20"
          />
          <div
            class="pointer-events-none absolute right-20 top-20 h-2 w-2 rounded-full bg-accent shadow-[0_0_20px_6px_color-mix(in_oklab,var(--accent)_30%,transparent)]"
          />
          <div
            class="pointer-events-none absolute right-40 top-40 hidden h-1.5 w-1.5 rounded-full bg-teal sm:block"
          />
          <div
            class="pointer-events-none absolute inset-0 dot-grid opacity-30 [mask-image:linear-gradient(90deg,#000,transparent_70%)]"
          />

          <div class="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
            <div class="relative z-10 max-w-[560px]">
              <div class="eyebrow">El siguiente paso</div>
              <h2
                class="mt-4 text-[1.85rem] font-[700] leading-[1.05] tracking-[-0.045em] text-ink sm:text-[2.55rem] lg:text-[2.85rem]"
              >
                Conectemos su próxima <span class="gradient-text">gran infraestructura.</span>
              </h2>
              <p class="mt-4 max-w-[46ch] text-[0.86rem] leading-[1.72] text-muted">
                Hablemos sobre su operación, sus metas de crecimiento y la red que las hará
                posibles. Compártanos sus requerimientos y coordinaremos los siguientes pasos.
              </p>
              <div class="mt-6 flex flex-col gap-2.5 sm:flex-row">
                <button
                  type="button"
                  class="btn btn-primary group h-11 px-5"
                  @click="$emit('quote')"
                >
                  Solicitar cotización
                  <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
                <a
                  :href="CONTACT.whatsapp"
                  target="_blank"
                  rel="noreferrer"
                  class="btn btn-ghost h-11 px-5"
                >
                  <MessageCircle class="h-4 w-4 text-emerald-500" />
                  WhatsApp directo
                </a>
              </div>
              <p class="mt-3.5 text-[0.66rem] text-muted/70">
                Respuesta en menos de 24 horas hábiles · Arequipa y todo el Perú
              </p>
            </div>

            <div
              class="relative z-10 flex min-h-[310px] flex-col overflow-hidden rounded-2xl border border-line bg-surface/80 shadow-[var(--shadow-card)]"
            >
              <div class="flex items-center justify-between gap-3 border-b border-line px-4 py-3.5">
                <div class="flex min-w-0 items-center gap-2.5">
                  <span
                    class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-accent/20 bg-accent/10 text-accent"
                  >
                    <MapPin class="h-4 w-4" />
                  </span>
                  <div class="min-w-0">
                    <p class="text-[0.7rem] font-semibold text-ink">Visítenos en Arequipa</p>
                    <p class="truncate text-[0.62rem] text-muted">{{ CONTACT.address }}</p>
                  </div>
                </div>
                <a
                  :href="directionsUrl"
                  target="_blank"
                  rel="noreferrer"
                  class="shrink-0 text-[0.65rem] font-semibold text-accent transition-colors hover:text-teal"
                >
                  Cómo llegar
                </a>
              </div>
              <iframe
                :title="`Mapa de ubicación: ${CONTACT.address}`"
                :src="mapEmbedUrl"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
                class="min-h-[250px] w-full flex-1 border-0 sm:min-h-[280px] lg:min-h-0"
              />
            </div>
          </div>
        </div>
      </BaseReveal>

      <div
        class="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_0.8fr_1.1fr] lg:gap-8 lg:py-14"
      >
        <div>
          <BrandLogo />
          <p class="mt-4 max-w-[30ch] text-[0.78rem] leading-[1.7] text-muted">
            Ingeniería en telecomunicaciones, redes, seguridad electrónica y energía eléctrica.
            Diseñamos infraestructura que sostiene operaciones críticas.
          </p>
          <div class="mt-5 flex items-center gap-2">
            <template v-for="label in socialLabels" :key="label">
              <a
                :href="label === 'Facebook' ? 'https://www.facebook.com/ccipsur/' : '#inicio'"
                :target="label === 'Facebook' ? '_blank' : undefined"
                :rel="label === 'Facebook' ? 'noreferrer' : undefined"
                :aria-label="label"
                class="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-surface/60 text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent"
              >
                <svg
                  v-if="label === 'LinkedIn'"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="h-3.5 w-3.5"
                  aria-hidden="true"
                >
                  <path
                    d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.2h4V21H3V9.2Zm6.5 0h3.8v1.6h.1c.5-.95 1.8-1.95 3.7-1.95 3.9 0 4.6 2.45 4.6 5.65V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.45-2.16 2.96V21h-4V9.2Z"
                  />
                </svg>
                <svg
                  v-else-if="label === 'Instagram'"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.8"
                  class="h-3.5 w-3.5"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.3" cy="6.8" r="1" fill="currentColor" stroke="none" />
                </svg>
                <svg
                  v-else
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="h-3.5 w-3.5"
                  aria-hidden="true"
                >
                  <path
                    d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.87.24-1.46 1.49-1.46h1.6V4.45c-.28-.04-1.24-.12-2.36-.12-2.34 0-3.94 1.43-3.94 4.05v2.12H7.6v3h2.69V21h3.21Z"
                  />
                </svg>
              </a>
            </template>
          </div>
          <div class="mt-5 flex flex-wrap gap-1.5">
            <span
              v-for="badge in ['ISO 9001', 'Fluke Networks', 'CNE', 'OTDR']"
              :key="badge"
              class="rounded-md border border-line px-2 py-1 text-[0.58rem] font-medium uppercase tracking-[0.08em] text-muted/80"
            >
              {{ badge }}
            </span>
          </div>
        </div>

        <div>
          <h3 class="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-ink">
            Servicios
          </h3>
          <ul class="mt-4 flex flex-col gap-2.5">
            <li v-for="service in SERVICES" :key="service.id">
              <a
                href="#servicios"
                class="text-[0.78rem] text-muted transition-colors hover:text-accent"
              >
                {{ service.title }}
              </a>
            </li>
            <li>
              <a
                href="#capacidades"
                class="text-[0.78rem] text-muted transition-colors hover:text-accent"
              >
                Ingeniería aplicada
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-ink">Compañía</h3>
          <ul class="mt-4 flex flex-col gap-2.5">
            <li
              v-for="link in [
                { label: 'Inicio', href: '#inicio' },
                { label: 'Capacidades', href: '#capacidades' },
                { label: 'Blog técnico', href: '#blog' },
                { label: 'Contáctenos', href: '#contacto' },
                { label: 'Trabaje con nosotros', href: '#contacto' },
              ]"
              :key="link.label"
            >
              <a
                :href="link.href"
                class="text-[0.78rem] text-muted transition-colors hover:text-accent"
              >
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-ink">Contacto</h3>
          <ul class="mt-4 flex flex-col gap-3 text-[0.76rem] text-muted">
            <li class="flex items-start gap-2.5">
              <MapPin class="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" :stroke-width="1.8" />
              <span class="leading-relaxed">{{ CONTACT.address }}</span>
            </li>
            <li>
              <a
                href="tel:+51992275316"
                class="flex items-start gap-2.5 transition-colors hover:text-accent"
              >
                <Phone class="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" :stroke-width="1.8" />
                +51 992 275 316
              </a>
            </li>
            <li>
              <a
                :href="`mailto:${CONTACT.email}`"
                class="flex items-start gap-2.5 transition-colors hover:text-accent"
              >
                <Mail class="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" :stroke-width="1.8" />
                {{ CONTACT.email }}
              </a>
            </li>
          </ul>

          <div class="mt-5">
            <p class="text-[0.68rem] font-semibold text-ink">Notas técnicas, una vez al mes.</p>
            <div
              v-if="subscribed"
              class="mt-2 flex items-center gap-2 rounded-lg border border-accent/25 bg-accent/[0.08] px-3 py-2.5 text-[0.7rem] font-medium text-accent"
            >
              <Check class="h-3.5 w-3.5" />
              Suscripción confirmada. Gracias.
            </div>
            <form v-else class="mt-2 flex items-center gap-1.5" @submit.prevent="subscribe">
              <label for="footer-email" class="sr-only">Correo electrónico</label>
              <input
                id="footer-email"
                v-model="email"
                type="email"
                required
                placeholder="Correo corporativo"
                class="input !h-9 !rounded-lg !px-2.5 !text-[0.72rem]"
              />
              <button
                type="submit"
                aria-label="Suscribirse al boletín"
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-ink transition-transform hover:scale-[1.04]"
              >
                <ArrowRight class="h-3.5 w-3.5" :stroke-width="2.2" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div
        class="flex flex-col items-start justify-between gap-4 border-t border-line py-6 sm:flex-row sm:items-center"
      >
        <p class="text-[0.66rem] leading-relaxed text-muted/70">
          © {{ new Date().getFullYear() }} CCIP Telecomunicaciones e Ingeniería. Todos los derechos
          reservados. · RUC 20559246272
        </p>
        <div class="flex flex-wrap items-center gap-x-5 gap-y-2">
          <button
            type="button"
            class="text-[0.66rem] text-muted/70 transition-colors hover:text-ink"
            @click="legalDocument = 'privacy'"
          >
            Privacidad
          </button>
          <button
            type="button"
            class="text-[0.66rem] text-muted/70 transition-colors hover:text-ink"
            @click="legalDocument = 'terms'"
          >
            Términos y condiciones
          </button>
          <a
            href="#inicio"
            class="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-[0.64rem] text-muted transition-colors hover:border-accent/40 hover:text-accent"
          >
            <ArrowUp class="h-3 w-3" />
            Inicio
          </a>
        </div>
      </div>
    </div>
    <div
      class="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-accent/[0.04] to-transparent"
    />
  </footer>
  <LegalDialog v-if="legalDocument" :doc-type="legalDocument" @close="legalDocument = null" />
</template>
