/** Tipos del contenido editorial del demo. Extraídos sin alterar ningún valor. */
export type Theme = 'light' | 'dark'

export type Service = {
  id: string
  slug: string
  icon: 'telecom' | 'network' | 'security' | 'energy'
  title: string
  short: string
  description: string
  items: string[]
  tag: string
}

export type Capability = {
  id: string
  label: string
  eyebrow: string
  title: string
  description: string
  bullets: string[]
  metrics: { value: string; label: string }[]
  image: string
  imageAlt: string
}

export type Post = {
  id: string
  slug: string
  featured: boolean
  category: string
  categoryIcon: 'telecom' | 'security' | 'energy'
  title: string
  excerpt: string
  date: string
  iso: string
  readTime: string
  body: { heading?: string; text: string; list?: string[] }[]
}

export type Testimonial = {
  id: string
  name: string
  role: string
  company: string
  message: string
}

export type ContactInfo = {
  address: string
  phone: string
  phoneHref: string
  email: string
  hours: string
  whatsapp: string
}

export type Stat = { value: string; label: string; detail: string }

export type ProcessStep = { step: string; title: string; text: string }

export type SiteContent = {
  trustClients: string[]
  stats: Stat[]
  process: ProcessStep[]
  contact: ContactInfo
}

export type LegalDocument = 'privacy' | 'terms'

export type LegalSection = { heading: string; text: string }

export type LegalContent = { title: string; sections: LegalSection[] }

export type LegalDocuments = Record<LegalDocument, LegalContent>
