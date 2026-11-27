import { defineEventHandler, getMethod, getRequestHeader, getRequestURL } from 'h3'
import { HttpError, sendProblem } from '../src/shared/http-error'

const WINDOW_MS = 60_000
const MAX_REQUESTS = 5
const RETRY_AFTER_SECONDS = 60
const hits = new Map<string, number[]>()

/**
 * Rate limit en aplicación para la API versionada. El legacy /api/contacto
 * mantiene su comportamiento y el límite de Nginx queda para la etapa de deploy.
 */
export default defineEventHandler((event) => {
  const { pathname } = getRequestURL(event)
  if (getMethod(event) !== 'POST' || pathname !== '/api/v1/contacto') return

  const forwarded = getRequestHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim()
  const key = forwarded || event.node.req.socket.remoteAddress || 'unknown'
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((timestamp) => now - timestamp < WINDOW_MS)

  if (recent.length >= MAX_REQUESTS) {
    hits.set(key, recent)
    return sendProblem(
      event,
      new HttpError(
        429,
        'Demasiadas solicitudes',
        'Intente nuevamente en un minuto.',
        RETRY_AFTER_SECONDS,
      ),
    )
  }

  recent.push(now)
  hits.set(key, recent)

  if (hits.size > 1000) {
    for (const [client, timestamps] of hits) {
      if (timestamps.every((timestamp) => now - timestamp >= WINDOW_MS)) hits.delete(client)
    }
  }
})
