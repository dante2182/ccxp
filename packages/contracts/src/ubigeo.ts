import { z } from 'zod'

/** Parámetros compartidos por las rutas de ubigeo. */
export const UbigeoParamsSchema = z.object({
  dep: z.string().trim().min(1),
  prov: z.string().trim().min(1).optional(),
})

export type UbigeoParams = z.infer<typeof UbigeoParamsSchema>

export const UbigeoResponseSchema = z.array(z.string())

export type UbigeoResponse = z.infer<typeof UbigeoResponseSchema>
