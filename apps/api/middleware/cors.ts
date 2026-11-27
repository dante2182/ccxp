import { defineEventHandler, getMethod, getRequestHeader, setHeader, setResponseStatus } from 'h3'
import { getAllowedOrigins } from '../src/config/env'

const allowedOrigins = new Set(getAllowedOrigins())

/** CORS restrictivo: mismo origen por defecto, allow-list explícita si se configura. */
export default defineEventHandler((event) => {
  const origin = getRequestHeader(event, 'origin')

  if (origin && allowedOrigins.has(origin)) {
    setHeader(event, 'access-control-allow-origin', origin)
    setHeader(event, 'access-control-allow-methods', 'GET, POST, OPTIONS')
    setHeader(event, 'access-control-allow-headers', 'content-type')
    setHeader(event, 'vary', 'Origin')
  }

  if (getMethod(event) === 'OPTIONS') {
    setResponseStatus(event, 204)
    return ''
  }
})
