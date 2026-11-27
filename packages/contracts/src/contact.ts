import { z } from 'zod'

/**
 * Contrato del formulario de contacto. Los requisitos reflejan las
 * validaciones actuales del frontend para no cambiar la experiencia de uso.
 */
export const ContactRequestSchema = z.object({
  tipo: z.string().trim().min(1),
  nombres: z.string().trim().min(2),
  apellidos: z.string().trim().min(2),
  dni: z.string().regex(/^\d{8}$/),
  telefono: z.string().regex(/^9\d{8}$/),
  email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  empresa: z.string().trim().optional().default(''),
  mensaje: z.string().trim().min(10),
  departamento: z.string().trim().min(1),
  provincia: z.string().trim().min(1),
  distrito: z.string().trim().min(1),
})

export type ContactRequest = z.infer<typeof ContactRequestSchema>

export const ContactResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
})

export type ContactResponse = z.infer<typeof ContactResponseSchema>
