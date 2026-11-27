import capabilities from '../data/capabilities.json'
import type { Capability } from '~/types/content.types'

/** Resource: capacidades técnicas. */
export default defineEventHandler((): Capability[] => capabilities as Capability[])
