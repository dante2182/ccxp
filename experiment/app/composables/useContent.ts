import { computed, type ComputedRef } from 'vue'
import type {
  Capability,
  LegalDocuments,
  Post,
  Service,
  SiteContent,
  Testimonial,
} from '~/types/content.types'

const EMPTY_SITE: SiteContent = {
  trustClients: [],
  stats: [],
  process: [],
  contact: {
    address: '',
    phone: '',
    phoneHref: '',
    email: '',
    hours: '',
    whatsapp: '',
  },
}

/**
 * Única puerta de entrada al contenido del servidor. Cada recurso tiene su
 * endpoint dedicado; useFetch comparte las peticiones por key y el SSR deja
 * el HTML poblado, sin desplazamientos visuales.
 */
export function useContent() {
  const { data: siteData } = useFetch<SiteContent>('/api/site', { key: 'content:site' })
  const { data: servicesData } = useFetch<Service[]>('/api/services', { key: 'content:services' })
  const { data: capabilitiesData } = useFetch<Capability[]>('/api/capabilities', {
    key: 'content:capabilities',
  })
  const { data: postsData } = useFetch<Post[]>('/api/posts', { key: 'content:posts' })
  const { data: testimonialsData } = useFetch<Testimonial[]>('/api/testimonials', {
    key: 'content:testimonials',
  })
  const { data: legalData } = useFetch<LegalDocuments>('/api/legal', { key: 'content:legal' })

  const site: ComputedRef<SiteContent> = computed(() => siteData.value ?? EMPTY_SITE)
  const services: ComputedRef<Service[]> = computed(() => servicesData.value ?? [])
  const capabilities: ComputedRef<Capability[]> = computed(() => capabilitiesData.value ?? [])
  const posts: ComputedRef<Post[]> = computed(() => postsData.value ?? [])
  const testimonials: ComputedRef<Testimonial[]> = computed(() => testimonialsData.value ?? [])
  const legal: ComputedRef<LegalDocuments> = computed(
    () =>
      legalData.value ?? {
        terms: { title: '', sections: [] },
        privacy: { title: '', sections: [] },
      },
  )

  return { site, services, capabilities, posts, testimonials, legal }
}
