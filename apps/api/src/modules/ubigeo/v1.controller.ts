import { UbigeoResponseSchema, type UbigeoResponse } from '@ccxp/contracts'
import { defineEventHandler, getRouterParam, type H3Event } from 'h3'
import { HttpError, sendProblem } from '../../shared/http-error'
import { UbigeoInvalidParamError, UbigeoNotFoundError } from './ubigeo.errors'
import type { UbigeoService } from './ubigeo.service'

function respond(
  event: H3Event,
  read: () => UbigeoResponse,
): UbigeoResponse | ReturnType<typeof sendProblem> {
  try {
    return UbigeoResponseSchema.parse(read())
  } catch (error) {
    if (error instanceof UbigeoInvalidParamError) {
      return sendProblem(event, new HttpError(422, error.message))
    }
    if (error instanceof UbigeoNotFoundError) {
      return sendProblem(event, new HttpError(404, error.message))
    }
    throw error
  }
}

/** Capas HTTP v1: cada handler solo lee parámetros y delega, con códigos semánticos. */
export function createUbigeoV1Controllers(service: UbigeoService) {
  return {
    getDepartamentos: defineEventHandler((event) =>
      respond(event, () => service.listDepartamentos()),
    ),

    getProvincias: defineEventHandler((event) =>
      respond(event, () => service.listProvinciasStrict(getRouterParam(event, 'dep'))),
    ),

    getDistritos: defineEventHandler((event) =>
      respond(event, () =>
        service.listDistritosStrict(getRouterParam(event, 'dep'), getRouterParam(event, 'prov')),
      ),
    ),
  }
}
