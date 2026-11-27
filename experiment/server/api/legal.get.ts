import legal from '../data/legal.json'
import type { LegalDocuments } from '~/types/content.types'

/** Resource: documentos legales. */
export default defineEventHandler((): LegalDocuments => legal as LegalDocuments)
