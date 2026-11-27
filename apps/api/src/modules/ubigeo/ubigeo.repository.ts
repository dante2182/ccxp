/** Acceso a datos de ubigeo, independiente del origen (JSON, BD, etc.). */
export interface UbigeoRepository {
  getDepartamentos(): string[]
  getProvincias(departamento: string): string[]
  getDistritos(departamento: string, provincia: string): string[]
}
