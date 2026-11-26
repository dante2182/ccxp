export type SubService = {
  title: string
  description: string
  image: string
  link?: string
}

export type Service = {
  slug: string
  title: string
  description: string
  longDescription?: string
  image: string
  heroImage?: string
  subServices?: SubService[]
}





