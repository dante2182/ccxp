export type { UbigeoParams, UbigeoResponse } from '@ccxp/contracts'

/** Departamento -> provincia -> distritos. */
export type UbigeoData = Record<string, Record<string, string[]>>
