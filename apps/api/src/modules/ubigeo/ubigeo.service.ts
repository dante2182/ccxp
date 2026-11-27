import { UbigeoParamsSchema, UbigeoResponseSchema, type UbigeoResponse } from '@ccxp/contracts'
import { UbigeoInvalidParamError, UbigeoNotFoundError } from './ubigeo.errors'
import type { UbigeoRepository } from './ubigeo.repository'

function decodeParam(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

/** Caso de uso de ubigeo: valida parámetros y consulta el repositorio. */
export class UbigeoService {
  constructor(private readonly repository: UbigeoRepository) {}

  listDepartamentos(): UbigeoResponse {
    return this.repository.getDepartamentos()
  }

  /** Contrato histórico: parámetros inválidos o inexistentes ⇒ [] con HTTP 200. */
  listProvincias(rawDep?: string): UbigeoResponse {
    const parsed = UbigeoParamsSchema.safeParse({ dep: decodeParam(rawDep ?? '') })
    return parsed.success ? this.repository.getProvincias(parsed.data.dep) : []
  }

  /** Contrato histórico: parámetros inválidos o inexistentes ⇒ [] con HTTP 200. */
  listDistritos(rawDep?: string, rawProv?: string): UbigeoResponse {
    const parsed = UbigeoParamsSchema.safeParse({
      dep: decodeParam(rawDep ?? ''),
      prov: decodeParam(rawProv ?? ''),
    })

    if (!parsed.success || !parsed.data.prov) {
      return []
    }

    return this.repository.getDistritos(parsed.data.dep, parsed.data.prov)
  }

  /** Contrato v1: 422 para parámetros inválidos, 404 si el recurso no existe. */
  listProvinciasStrict(rawDep?: string): UbigeoResponse {
    const parsed = UbigeoParamsSchema.safeParse({ dep: decodeParam(rawDep ?? '') })
    if (!parsed.success) throw new UbigeoInvalidParamError('Parámetro dep inválido')

    const result = this.repository.getProvincias(parsed.data.dep)
    if (result.length === 0) throw new UbigeoNotFoundError('Departamento no encontrado')

    return UbigeoResponseSchema.parse(result)
  }

  /** Contrato v1: 422 para parámetros inválidos, 404 si el recurso no existe. */
  listDistritosStrict(rawDep?: string, rawProv?: string): UbigeoResponse {
    const parsed = UbigeoParamsSchema.safeParse({
      dep: decodeParam(rawDep ?? ''),
      prov: decodeParam(rawProv ?? ''),
    })
    if (!parsed.success || !parsed.data.prov) {
      throw new UbigeoInvalidParamError('Parámetros dep y prov son obligatorios')
    }

    const result = this.repository.getDistritos(parsed.data.dep, parsed.data.prov)
    if (result.length === 0) throw new UbigeoNotFoundError('Provincia no encontrada')

    return UbigeoResponseSchema.parse(result)
  }
}
