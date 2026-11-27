<script setup lang="ts">
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Clock,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
} from '@lucide/vue'
import { CONTACT, SERVICES } from '~/data/content'
import { cn } from '~/utils/cn'

type FormState = {
  nombre: string
  empresa: string
  email: string
  telefono: string
  servicio: string
  mensaje: string
  acepta: boolean
}

const EMPTY_FORM: FormState = {
  nombre: '',
  empresa: '',
  email: '',
  telefono: '',
  servicio: '',
  mensaje: '',
  acepta: false,
}

type Errors = Partial<Record<keyof FormState, string>>

const props = defineProps<{ preselect?: string }>()

const form = reactive<FormState>({ ...EMPTY_FORM })
const errors = reactive<Errors>({})
const loading = ref(false)
const submitted = ref(false)
const folio = ref('')
const isExpanded = ref(false)
let timer: number | undefined

watch(
  () => props.preselect,
  (preselect) => {
    const value = SERVICES.some((s) => s.slug === preselect)
      ? preselect
      : preselect
        ? 'Otra solución / asesoría a medida'
        : undefined
    if (value) {
      submitted.value = false
      form.servicio = value
    }
  },
)

onBeforeUnmount(() => {
  if (timer) window.clearTimeout(timer)
})

const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
  form[key] = value
  errors[key] = undefined
}

const validate = () => {
  const next: Errors = {}
  if (form.nombre.trim().length < 3) next.nombre = 'Ingrese su nombre completo.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
    next.email = 'Ingrese un correo válido.'
  if (!form.servicio) next.servicio = 'Seleccione un servicio de interés.'
  if (form.mensaje.trim().length < 10) {
    next.mensaje = 'Cuéntenos brevemente su necesidad (mín. 10 caracteres).'
  }
  if (!form.acepta) next.acepta = 'Necesitamos su consentimiento para contactarlo.'
  return next
}

const onSubmit = () => {
  const next = validate()
  Object.assign(errors, next)
  const firstKey = Object.keys(next)[0] as keyof FormState | undefined
  if (firstKey) {
    document.getElementById(`field-${firstKey}`)?.focus()
    return
  }
  loading.value = true
  timer = window.setTimeout(() => {
    loading.value = false
    submitted.value = true
    folio.value = `CCIP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 8999)}`
  }, 1100)
}

const handleContinue = (event: MouseEvent) => {
  if (!isExpanded.value) {
    event.preventDefault()
    isExpanded.value = true
  }
}

const resetForm = () => {
  submitted.value = false
  Object.assign(form, EMPTY_FORM)
  Object.keys(errors).forEach((key) => {
    errors[key as keyof FormState] = undefined
  })
  isExpanded.value = false
}

const contactItems = [
  { icon: MapPin, label: 'Dirección', value: CONTACT.address, href: undefined },
  { icon: Phone, label: 'Teléfono', value: CONTACT.phone, href: `tel:${CONTACT.phoneHref}` },
  { icon: Mail, label: 'Correo', value: CONTACT.email, href: `mailto:${CONTACT.email}` },
  { icon: Clock, label: 'Horario de atención', value: CONTACT.hours, href: undefined },
]
const cities = ['Arequipa', 'Lima', 'Cusco', 'Puno', 'Moquegua', 'Tacna']
</script>

<template>
  <section
    id="contacto"
    class="relative overflow-hidden border-t border-line bg-bg-deep/40 pt-5 pb-8 sm:pt-8 sm:pb-12 lg:pt-10 lg:pb-16"
  >
    <div
      class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_45%_at_50%_0%,var(--glow-b),transparent_72%)]"
    />
    <div
      class="pointer-events-none absolute -right-24 bottom-10 -z-10 h-[320px] w-[320px] rounded-full bg-accent/8 blur-[100px]"
    />
    <div class="container-x">
      <BaseReveal>
        <SectionHeading
          eyebrow="Contáctenos"
          description="Cuéntenos sobre su proyecto y un ingeniero de CCIP se pondrá en contacto para conocer sus requerimientos y coordinar una propuesta técnica."
        >
          <template #title
            >Solicite su cotización <span class="gradient-text">gratuita</span></template
          >
        </SectionHeading>
      </BaseReveal>

      <div class="mt-11 grid gap-4 lg:grid-cols-[0.88fr_1.32fr] lg:gap-5">
        <div class="flex flex-col gap-4">
          <BaseReveal :delay="100" :class="!isExpanded && 'h-full'">
            <div :class="cn('panel p-5 sm:p-6', !isExpanded && 'h-full')">
              <h3 class="text-[0.98rem] font-semibold tracking-[-0.02em] text-ink">
                Información de contacto
              </h3>
              <div class="mt-5 flex flex-col gap-4">
                <div
                  v-for="item in contactItems"
                  :key="item.label"
                  class="group flex items-start gap-3"
                >
                  <span
                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-accent/20 bg-accent/8 text-accent transition-colors group-hover:bg-accent/12"
                  >
                    <component :is="item.icon" class="h-4 w-4" :stroke-width="1.7" />
                  </span>
                  <div class="min-w-0">
                    <p class="text-[0.72rem] font-semibold text-ink">{{ item.label }}</p>
                    <a
                      v-if="item.href"
                      :href="item.href"
                      class="mt-0.5 block break-words text-[0.75rem] text-muted transition-colors hover:text-accent"
                    >
                      {{ item.value }}
                    </a>
                    <p v-else class="mt-0.5 text-[0.75rem] leading-relaxed text-muted">
                      {{ item.value }}
                    </p>
                  </div>
                </div>
              </div>

              <a
                :href="CONTACT.whatsapp"
                target="_blank"
                rel="noreferrer"
                class="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#22c55e] text-[0.82rem] font-semibold text-white shadow-[0_12px_26px_-14px_rgba(34,197,94,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1db154]"
              >
                <MessageCircle class="h-[18px] w-[18px]" :stroke-width="2" />
                Escribir por WhatsApp
              </a>

              <div class="mt-5 border-t border-line pt-4">
                <p class="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-muted/70">
                  Cobertura
                </p>
                <div class="mt-2.5 flex flex-wrap gap-1.5">
                  <span
                    v-for="city in cities"
                    :key="city"
                    class="rounded-md border border-line bg-surface-2/60 px-2 py-1 text-[0.64rem] font-medium text-muted"
                  >
                    {{ city }}
                  </span>
                </div>
              </div>
            </div>
          </BaseReveal>
          <div v-if="isExpanded" class="flex flex-col gap-4">
            <ProjectCard />
          </div>
        </div>

        <BaseReveal :delay="140" class="h-full">
          <div v-if="submitted" :class="cn('panel p-5 sm:p-8', !isExpanded && 'h-full')">
            <div
              class="animate-rise flex min-h-[420px] flex-col items-center justify-center py-8 text-center"
            >
              <div class="relative">
                <div class="absolute inset-0 animate-ping rounded-full bg-accent/15" />
                <div
                  class="relative flex h-16 w-16 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent"
                >
                  <CheckCircle2 class="h-8 w-8" :stroke-width="1.7" />
                </div>
              </div>
              <h3 class="mt-6 text-[1.5rem] font-[680] tracking-[-0.035em] text-ink">
                Solicitud recibida
              </h3>
              <p class="mt-2 max-w-[38ch] text-[0.85rem] leading-relaxed text-muted">
                Gracias,
                <span class="font-semibold text-ink">{{ form.nombre.split(' ')[0] }}</span>. Un
                ingeniero revisará su requerimiento y se contactará con usted en menos de 24 horas
                hábiles.
              </p>
              <div
                class="mt-5 flex flex-col items-center gap-1.5 rounded-xl border border-line bg-surface-2/60 px-5 py-3"
              >
                <span class="text-[0.6rem] uppercase tracking-[0.16em] text-muted"
                  >Folio de solicitud</span
                >
                <span class="tabular text-[0.92rem] font-semibold tracking-[0.04em] text-ink">{{
                  folio
                }}</span>
              </div>
              <div class="mt-6 flex flex-col gap-2.5 sm:flex-row">
                <button type="button" class="btn btn-ghost h-11 px-5" @click="resetForm">
                  Enviar otra solicitud
                </button>
                <a
                  :href="CONTACT.whatsapp"
                  target="_blank"
                  rel="noreferrer"
                  class="btn btn-primary h-11 px-5"
                >
                  <MessageCircle class="h-4 w-4" />
                  Escribir por WhatsApp
                </a>
              </div>
            </div>
          </div>
          <div v-else :class="cn('panel p-5 sm:p-8', !isExpanded && 'h-full')">
            <form novalidate @submit.prevent="onSubmit">
              <div class="mb-6 flex items-center justify-between gap-3">
                <div>
                  <h3 class="text-[1.02rem] font-semibold tracking-[-0.025em] text-ink">
                    Formulario de contacto
                  </h3>
                  <p class="mt-1 text-[0.73rem] text-muted">
                    Los campos marcados con * son obligatorios.
                  </p>
                </div>
                <span
                  class="hidden items-center gap-1.5 rounded-full border border-accent/25 bg-accent/[0.08] px-2.5 py-1.5 text-[0.6rem] font-semibold text-accent sm:inline-flex"
                >
                  <ShieldCheck class="h-3 w-3" />
                  Datos protegidos
                </span>
              </div>

              <div class="grid gap-4 sm:grid-cols-2">
                <div class="sm:col-span-2">
                  <label for="field-nombre" class="field-label">Nombre completo *</label>
                  <input
                    id="field-nombre"
                    v-model="form.nombre"
                    name="nombre"
                    type="text"
                    autocomplete="name"
                    placeholder="Ej. Carlos Rodríguez"
                    :aria-invalid="Boolean(errors.nombre)"
                    :aria-describedby="errors.nombre ? 'error-nombre' : undefined"
                    class="input"
                    @input="update('nombre', form.nombre)"
                  />
                  <p
                    v-if="errors.nombre"
                    id="error-nombre"
                    class="mt-1.5 text-[0.68rem] text-rose-500"
                  >
                    {{ errors.nombre }}
                  </p>
                </div>
                <div>
                  <label for="field-empresa" class="field-label">Empresa</label>
                  <input
                    id="field-empresa"
                    v-model="form.empresa"
                    name="empresa"
                    type="text"
                    autocomplete="organization"
                    placeholder="Nombre de su empresa"
                    class="input"
                  />
                </div>
                <div>
                  <label for="field-telefono" class="field-label">Teléfono</label>
                  <input
                    id="field-telefono"
                    v-model="form.telefono"
                    name="telefono"
                    type="tel"
                    autocomplete="tel"
                    inputmode="tel"
                    placeholder="+51 999 999 999"
                    class="input"
                  />
                </div>
              </div>

              <div
                id="additional-request-fields"
                :hidden="!isExpanded"
                :class="isExpanded && 'animate-rise'"
              >
                <div class="mt-4">
                  <label for="field-email" class="field-label">Correo corporativo *</label>
                  <input
                    id="field-email"
                    v-model="form.email"
                    name="email"
                    type="email"
                    autocomplete="email"
                    placeholder="nombre@empresa.com"
                    :aria-invalid="Boolean(errors.email)"
                    :aria-describedby="errors.email ? 'error-email' : undefined"
                    class="input"
                    @input="update('email', form.email)"
                  />
                  <p
                    v-if="errors.email"
                    id="error-email"
                    class="mt-1.5 text-[0.68rem] text-rose-500"
                  >
                    {{ errors.email }}
                  </p>
                </div>

                <div class="mt-4">
                  <label for="field-servicio" class="field-label">Servicio de interés *</label>
                  <div class="relative">
                    <select
                      id="field-servicio"
                      v-model="form.servicio"
                      name="servicio"
                      :aria-invalid="Boolean(errors.servicio)"
                      :aria-describedby="errors.servicio ? 'error-servicio' : undefined"
                      :class="cn('appearance-none pr-10', !form.servicio && 'text-muted')"
                      @change="update('servicio', form.servicio)"
                    >
                      <option value="">Seleccione un servicio</option>
                      <option v-for="service in SERVICES" :key="service.id" :value="service.slug">
                        {{ service.title }}
                      </option>
                      <option value="Otra solución / asesoría a medida">
                        Otra solución / asesoría a medida
                      </option>
                    </select>
                    <ChevronDown
                      class="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                    />
                  </div>
                  <p
                    v-if="errors.servicio"
                    id="error-servicio"
                    class="mt-1.5 text-[0.68rem] text-rose-500"
                  >
                    {{ errors.servicio }}
                  </p>
                </div>

                <div class="mt-4">
                  <label for="field-mensaje" class="field-label">Mensaje *</label>
                  <textarea
                    id="field-mensaje"
                    v-model="form.mensaje"
                    name="mensaje"
                    rows="5"
                    placeholder="Describa brevemente su proyecto o necesidad técnica..."
                    :aria-invalid="Boolean(errors.mensaje)"
                    :aria-describedby="errors.mensaje ? 'error-mensaje' : undefined"
                    class="input resize-none"
                    @input="update('mensaje', form.mensaje)"
                  />
                  <div class="mt-1.5 flex items-center justify-between gap-3">
                    <p
                      v-if="errors.mensaje"
                      id="error-mensaje"
                      class="text-[0.68rem] text-rose-500"
                    >
                      {{ errors.mensaje }}
                    </p>
                    <span v-else />
                    <span class="text-[0.64rem] text-muted/70">{{ form.mensaje.length }}/800</span>
                  </div>
                </div>

                <div class="mt-4">
                  <label
                    for="field-acepta"
                    class="flex cursor-pointer items-start gap-2.5 text-[0.72rem] leading-relaxed text-muted"
                  >
                    <input
                      id="field-acepta"
                      v-model="form.acepta"
                      name="acepta"
                      type="checkbox"
                      :aria-invalid="Boolean(errors.acepta)"
                      :aria-describedby="errors.acepta ? 'error-acepta' : undefined"
                      class="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-line accent-accent"
                      @change="update('acepta', form.acepta)"
                    />
                    Acepto ser contactado por CCIP para atender esta solicitud y el tratamiento de
                    mis datos según la política de privacidad.
                  </label>
                  <p
                    v-if="errors.acepta"
                    id="error-acepta"
                    class="mt-1.5 text-[0.68rem] text-rose-500"
                  >
                    {{ errors.acepta }}
                  </p>
                </div>
              </div>

              <button
                type="submit"
                :disabled="loading"
                :aria-expanded="isExpanded"
                aria-controls="additional-request-fields"
                class="btn btn-primary mt-5 h-12 w-full disabled:opacity-80"
                @click="handleContinue"
              >
                <template v-if="loading">
                  <Loader2 class="h-4 w-4 animate-spin" />
                  Enviando solicitud...
                </template>
                <template v-else-if="isExpanded">Enviar solicitud de cotización</template>
                <template v-else>Completar solicitud</template>
              </button>
              <p class="mt-3 text-center text-[0.64rem] text-muted/70">
                Respuesta de un ingeniero en menos de 24 horas hábiles. Sin compromiso.
              </p>
            </form>
          </div>
        </BaseReveal>
      </div>

      <div v-if="!isExpanded" class="mt-4"><ProjectCard /></div>

      <BaseReveal :delay="80">
        <div
          class="mt-8 flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:gap-6"
        >
          <p class="text-[0.72rem] text-muted">
            ¿Prefiere una conversación directa con el equipo técnico?
          </p>
          <a :href="CONTACT.whatsapp" target="_blank" rel="noreferrer" class="link-arrow">
            Agendar una llamada
            <ArrowRight class="h-3.5 w-3.5" />
          </a>
        </div>
      </BaseReveal>
    </div>
  </section>
</template>
