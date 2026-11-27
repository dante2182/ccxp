import { describe, expect, it } from 'vitest'
import type { UbigeoRepository } from './ubigeo.repository'
import { UbigeoService } from './ubigeo.service'

const fakeRepository: UbigeoRepository = {
  getDepartamentos: () => ['Lima', 'Arequipa'],
  getProvincias: (departamento) => (departamento === 'Lima' ? ['Lima', 'Cañete'] : []),
  getDistritos: (departamento, provincia) =>
    departamento === 'Lima' && provincia === 'Lima' ? ['Miraflores', 'Barranco'] : [],
}

const service = new UbigeoService(fakeRepository)

describe('UbigeoService', () => {
  it('lista departamentos', () => {
    expect(service.listDepartamentos()).toEqual(['Lima', 'Arequipa'])
  })

  it('lista provincias y decodifica parámetros', () => {
    expect(service.listProvincias('Lima')).toEqual(['Lima', 'Cañete'])
    expect(service.listProvincias('%20')).toEqual([])
  })

  it('lista distritos y decodifica parámetros', () => {
    expect(service.listDistritos('Lima', 'Lima')).toEqual(['Miraflores', 'Barranco'])
    expect(service.listDistritos('Lima', '%20')).toEqual([])
  })

  it('devuelve lista vacía para parámetros inválidos', () => {
    expect(service.listProvincias('')).toEqual([])
    expect(service.listDistritos('Lima', '')).toEqual([])
  })
})
