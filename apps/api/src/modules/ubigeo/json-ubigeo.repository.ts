import type { UbigeoData } from './ubigeo.types'
import type { UbigeoRepository } from './ubigeo.repository'

/** Repositorio que lee el JSON estático migrado desde la app Nuxt. */
export class JsonUbigeoRepository implements UbigeoRepository {
  constructor(private readonly data: UbigeoData) {}

  getDepartamentos(): string[] {
    return Object.keys(this.data)
  }

  getProvincias(departamento: string): string[] {
    return Object.keys(this.data[departamento] ?? {})
  }

  getDistritos(departamento: string, provincia: string): string[] {
    return this.data[departamento]?.[provincia] ?? []
  }
}
