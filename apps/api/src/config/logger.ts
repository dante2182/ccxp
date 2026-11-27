import pino from 'pino'
import { env } from './env'

/** Logger estructurado; nunca incluye el body del formulario. */
export const logger = pino({
  level: env.LOG_LEVEL,
  base: {
    service: 'ccxp-api',
    env: env.NODE_ENV,
  },
  redact: {
    paths: ['password', 'smtpPassword', 'body', 'req.body', 'req.headers.authorization'],
    remove: true,
  },
})
