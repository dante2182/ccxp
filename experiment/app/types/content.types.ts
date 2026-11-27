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
  category: string
  categoryIcon: 'telecom' | 'security' | 'energy'
  title: string
  excerpt: string
  date: string
  iso: string
  readTime: string
  body: { heading?: string; text: string; list?: string[] }[]
}

export type LegalDocument = 'privacy' | 'terms'
