import { describe, expect, it } from 'vitest'
import { UbigeoParamsSchema, UbigeoResponseSchema } from './ubigeo'

describe('UbigeoParamsSchema', () => {
  it('acepta departamento solo', () => {
    expect(UbigeoParamsSchema.safeParse({ dep: 'Lima' }).success).toBe(true)
  })

  it('acepta departamento y provincia', () => {
    expect(UbigeoParamsSchema.safeParse({ dep: 'Lima', prov: 'Lima' }).success).toBe(true)
  })

  it('rechaza parámetros vacíos', () => {
    expect(UbigeoParamsSchema.safeParse({ dep: '' }).success).toBe(false)
    expect(UbigeoParamsSchema.safeParse({ dep: 'Lima', prov: '' }).success).toBe(false)
  })
})

describe('UbigeoResponseSchema', () => {
  it('valida listas de nombres', () => {
    expect(UbigeoResponseSchema.safeParse(['Lima', 'Arequipa']).success).toBe(true)
  })

  it('rechaza respuestas que no son listas de texto', () => {
    expect(UbigeoResponseSchema.safeParse([1, 2]).success).toBe(false)
  })
})
