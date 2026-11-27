/**
 * Punto único de logging del cliente.
 * Mañana se puede sustituir por un transporte estructurado sin tocar los
 * composables que reportan fallos.
 */
export const logger = {
  error(context: string, error: unknown): void {
    console.error(`[ccxp] ${context}`, error)
  },
}
