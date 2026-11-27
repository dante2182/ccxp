import { UbigeoParamsSchema, type UbigeoResponse } from '@ccxp/contracts'
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

  listProvincias(rawDep?: string): UbigeoResponse {
    const parsed = UbigeoParamsSchema.safeParse({ dep: decodeParam(rawDep ?? '') })
    return parsed.success ? this.repository.getProvincias(parsed.data.dep) : []
  }

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
}
