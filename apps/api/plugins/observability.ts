import { randomUUID } from 'node:crypto'
import { setHeader, setResponseStatus } from 'h3'
import { defineNitroPlugin } from 'nitropack/runtime'
import pinoHttp from 'pino-http'
import { logger } from '../src/config/logger'
import { closeServices } from '../src/container'
import { HttpError } from '../src/shared/http-error'

const httpLogger = pinoHttp({
  logger,
  genReqId: () => randomUUID(),
  serializers: {
    req: (req) => ({ method: req.method, url: req.url }),
    res: (res) => ({ statusCode: res.statusCode }),
  },
})

/** Request-id, logs JSON, errores centralizados y cierre de recursos. */
export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook('request', (event) => {
    const requestId = String(event.node.req.id ?? randomUUID())
    event.context.requestId = requestId
    setHeader(event, 'x-request-id', requestId)
    httpLogger(event.node.req, event.node.res)
  })

  nitro.hooks.hook('error', (error, context) => {
    logger.error({ err: error, requestId: context.event?.context.requestId }, 'Unhandled API error')
    if (context.event) {
      const status =
        error instanceof HttpError
          ? error.status
          : ((error as { statusCode?: number }).statusCode ?? 500)
      setResponseStatus(context.event, status)
    }
  })

  nitro.hooks.hook('close', async () => {
    await closeServices()
    logger.info('API shutdown complete')
  })
})
