import testimonials from '../data/testimonials.json'
import type { Testimonial } from '~/types/content.types'

/**
 * Resource: testimonios curados. El archivo empieza vacío y acepta nuevas
 * entradas sin tocar el frontend.
 */
export default defineEventHandler((): Testimonial[] => testimonials as Testimonial[])
