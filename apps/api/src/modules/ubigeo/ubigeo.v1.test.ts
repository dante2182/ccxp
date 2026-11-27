import { describe, expect, it } from 'vitest'
import { HttpError } from '../../shared/http-error'
import { UbigeoInvalidParamError, UbigeoNotFoundError } from './ubigeo.errors'
import type { UbigeoRepository } from './ubigeo.repository'
import { UbigeoService } from './ubigeo.service'

const fakeRepository: UbigeoRepository = {
  getDepartamentos: () => ['Lima', 'Arequipa'],
  getProvincias: (departamento) => (departamento === 'Lima' ? ['Lima', 'Cañete'] : []),
  getDistritos: (departamento, provincia) =>
    departamento === 'Lima' && provincia === 'Lima' ? ['Miraflores', 'Barranco'] : [],
}

const service = new UbigeoService(fakeRepository)

describe('UbigeoService (contrato v1)', () => {
  it('lista departamentos', () => {
    expect(service.listDepartamentos()).toEqual(['Lima', 'Arequipa'])
  })

  it('devuelve provincias para un departamento existente', () => {
    expect(service.listProvinciasStrict('Lima')).toEqual(['Lima', 'Cañete'])
  })

  it('marca parámetros inválidos con UbigeoInvalidParamError', () => {
    expect(() => service.listProvinciasStrict('')).toThrow(UbigeoInvalidParamError)
    expect(() => service.listDistritosStrict('Lima', '')).toThrow(UbigeoInvalidParamError)
  })

  it('marca recursos inexistentes con UbigeoNotFoundError', () => {
    expect(() => service.listProvinciasStrict('Inexistente')).toThrow(UbigeoNotFoundError)
    expect(() => service.listDistritosStrict('Lima', 'Inexistente')).toThrow(UbigeoNotFoundError)
  })

  it('expone un HttpError 422 y 404 para los controladores', () => {
    expect(new HttpError(422, 'Payload inválido').status).toBe(422)
    expect(new HttpError(404, 'No encontrado').status).toBe(404)
  })
})
