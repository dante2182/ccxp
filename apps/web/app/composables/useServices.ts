import servicesJson from '@/data/services.json'
import type { Service } from '@/types/service.types'

/** Retorna todos los servicios */
export const getAllServices = (): Service[] => servicesJson

/** Retorna un servicio por slug (el primero que coincida) */
export const getServiceBySlug = (slug: string): Service | undefined =>
  servicesJson.find((service) => service.slug === slug)
