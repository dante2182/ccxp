import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

const booleanFromString = z
  .enum(['true', 'false'])
  .default('true')
  .transform((value) => value === 'true')

/**
 * Configuración validada en el arranque. Los valores SMTP pueden estar vacíos
 * para que el servidor arranque sin credenciales; el envío falla de forma
 * controlada con el mismo contrato HTTP que antes.
 */
export const env = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().int().positive().default(3001),
    SMTP_HOST: z.string().min(1).default('smtp.gmail.com'),
    SMTP_PORT: z.coerce.number().int().positive().default(465),
    SMTP_SECURE: booleanFromString,
    SMTP_USER: z.string().default(''),
    SMTP_PASSWORD: z.string().default(''),
    MAIL_FROM: z.string().default(''),
    MAIL_TO: z.string().default(''),
    CORS_ORIGINS: z.string().default(''),
    LOG_LEVEL: z
      .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
      .default('info'),
    NITRO_SHUTDOWN_TIMEOUT: z.coerce.number().int().positive().default(5),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})

export interface SmtpConfig {
  host: string
  port: number
  secure: boolean
  user: string
  password: string
  from: string
  to: string
}

export function getSmtpConfig(): SmtpConfig {
  return {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    user: env.SMTP_USER,
    password: env.SMTP_PASSWORD,
    from: env.MAIL_FROM || env.SMTP_USER,
    to: env.MAIL_TO,
  }
}

export function getAllowedOrigins(): string[] {
  return env.CORS_ORIGINS.split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0)
}
