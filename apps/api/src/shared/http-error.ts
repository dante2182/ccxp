import type { ProblemDetails, ProblemStatus } from '@ccxp/contracts'
import { getRequestURL, setHeader, setResponseStatus, type H3Event } from 'h3'

/** Error de aplicación con código HTTP explícito. */
export class HttpError extends Error {
  constructor(
    readonly status: ProblemStatus,
    message: string,
    readonly detail?: string,
    readonly retryAfter?: number,
  ) {
    super(message)
    this.name = 'HttpError'
  }
}

export function toProblem(error: HttpError, event?: H3Event): ProblemDetails {
  return {
    status: error.status,
    title: error.message,
    ...(error.detail ? { detail: error.detail } : {}),
    ...(event ? { instance: getRequestURL(event).pathname } : {}),
    ...(error.retryAfter === undefined ? {} : { retryAfter: error.retryAfter }),
  }
}

/** Escribe el código y devuelve el cuerpo Problem+JSON. */
export function sendProblem(event: H3Event, error: HttpError): ProblemDetails {
  setResponseStatus(event, error.status)
  setHeader(event, 'content-type', 'application/problem+json; charset=utf-8')
  if (error.retryAfter !== undefined) setHeader(event, 'Retry-After', error.retryAfter)
  return toProblem(error, event)
}
