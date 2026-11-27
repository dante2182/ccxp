import services from '../data/services.json'
import type { Service } from '~/types/content.types'

/** Resource: servicios. */
export default defineEventHandler((): Service[] => services as Service[])
