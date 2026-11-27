import site from '../data/site.json'
import type { SiteContent } from '~/types/content.types'

/** Configuración editorial y de contacto del sitio. */
export default defineEventHandler((): SiteContent => site as SiteContent)
