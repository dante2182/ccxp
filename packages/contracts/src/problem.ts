import { z } from 'zod'

/** Códigos semánticos expuestos por la API versionada. */
export const ProblemStatusSchema = z.union([
  z.literal(400),
  z.literal(404),
  z.literal(422),
  z.literal(429),
  z.literal(500),
  z.literal(504),
])

export type ProblemStatus = z.infer<typeof ProblemStatusSchema>

/** Cuerpo de error consistente para /api/v1/**. */
export const ProblemDetailsSchema = z.object({
  status: ProblemStatusSchema,
  title: z.string().min(1),
  detail: z.string().optional(),
  instance: z.string().optional(),
  retryAfter: z.number().int().nonnegative().optional(),
})

export type ProblemDetails = z.infer<typeof ProblemDetailsSchema>
