import { defineEventHandler, readBody } from 'h3'
import { HttpError, sendProblem } from '../../shared/http-error'
import type { ContactService } from './contact.service'

/** Capa HTTP de /api/v1/contacto: JSON malformado ⇒ 400, el resto lo mapea el servicio. */
export function createContactV1Controller(service: ContactService) {
  return defineEventHandler(async (event) => {
    let body: unknown
    try {
      body = await readBody(event)
    } catch {
      return sendProblem(
        event,
        new HttpError(400, 'JSON malformado', 'El cuerpo de la petición debe ser JSON válido'),
      )
    }

    try {
      return await service.sendStrict(body)
    } catch (error) {
      if (error instanceof HttpError) return sendProblem(event, error)
      throw error
    }
  })
}
