import type { H3Event } from 'h3'
import { defineEventHandler, readBody } from 'h3'
import type { ContactService } from './contact.service'

/** Capa HTTP delgada: delega toda la lógica al servicio inyectado. */
export function createContactController(service: ContactService) {
  return defineEventHandler(async (event: H3Event) => {
    let body: unknown = null
    try {
      body = await readBody(event)
    } catch {
      // Se mantiene el contrato histórico: errores de payload ⇒ 200 + success:false.
    }
    return service.send(body)
  })
}
