import { describe, expect, it } from 'vitest'
import { ContactRequestSchema, type ContactRequest } from './contact'

const validContact: ContactRequest = {
  tipo: 'Cotización',
  nombres: 'Ana',
  apellidos: 'Pérez',
  dni: '12345678',
  telefono: '987654321',
  email: 'ana@example.com',
  empresa: '',
  mensaje: 'Necesito una cotización de redes.',
  departamento: 'Lima',
  provincia: 'Lima',
  distrito: 'Miraflores',
}

describe('ContactRequestSchema', () => {
  it('acepta los 11 campos actuales del formulario', () => {
    expect(ContactRequestSchema.safeParse(validContact).success).toBe(true)
  })

  it('aplica valor por defecto a empresa', () => {
    const result = ContactRequestSchema.safeParse({ ...validContact, empresa: undefined })

    expect(result.success).toBe(true)
    if (result.success) expect(result.data.empresa).toBe('')
  })

  it('rechaza DNI, teléfono o correo inválidos', () => {
    expect(ContactRequestSchema.safeParse({ ...validContact, dni: '123' }).success).toBe(false)
    expect(ContactRequestSchema.safeParse({ ...validContact, telefono: '123456789' }).success).toBe(
      false,
    )
    expect(ContactRequestSchema.safeParse({ ...validContact, email: 'ana' }).success).toBe(false)
  })

  it('rechaza mensajes cortos', () => {
    expect(ContactRequestSchema.safeParse({ ...validContact, mensaje: 'Hola' }).success).toBe(false)
  })
})
