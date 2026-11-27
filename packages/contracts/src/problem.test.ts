import { describe, expect, it } from 'vitest'
import { ProblemDetailsSchema } from './problem'

describe('ProblemDetailsSchema', () => {
  it('acepta los códigos semánticos de la API v1', () => {
    for (const status of [400, 404, 422, 429, 500, 504]) {
      expect(ProblemDetailsSchema.parse({ status, title: 'Error' })).toEqual({
        status,
        title: 'Error',
      })
    }
  })

  it('rechaza códigos que no son errores', () => {
    expect(ProblemDetailsSchema.safeParse({ status: 200, title: 'OK' }).success).toBe(false)
  })

  it('acepta Retry-After para 429', () => {
    expect(
      ProblemDetailsSchema.parse({ status: 429, title: 'Too Many Requests', retryAfter: 60 }),
    ).toMatchObject({ retryAfter: 60 })
  })
})
