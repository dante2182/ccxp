import { defineEventHandler, getRouterParam } from 'h3'
import type { UbigeoService } from './ubigeo.service'

/** Capas HTTP delgadas: cada handler solo lee parámetros y delega. */
export function createUbigeoControllers(service: UbigeoService) {
  return {
    getDepartamentos: defineEventHandler(() => service.listDepartamentos()),

    getProvincias: defineEventHandler((event) =>
      service.listProvincias(getRouterParam(event, 'dep')),
    ),

    getDistritos: defineEventHandler((event) =>
      service.listDistritos(getRouterParam(event, 'dep'), getRouterParam(event, 'prov')),
    ),
  }
}
