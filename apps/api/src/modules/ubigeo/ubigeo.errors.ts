/** Error de dominio: parámetro de ubigeo inválido. */
export class UbigeoInvalidParamError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UbigeoInvalidParamError'
  }
}

/** Error de dominio: departamento o provincia inexistente. */
export class UbigeoNotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UbigeoNotFoundError'
  }
}
