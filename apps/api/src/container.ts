import { getSmtpConfig } from './config/env'
import { logger } from './config/logger'
import { createContactController } from './modules/contact/controller'
import { ContactService } from './modules/contact/contact.service'
import { SmtpMailSender } from './modules/contact/smtp-mail-sender'
import { createContactV1Controller } from './modules/contact/v1.controller'
import ubigeoJson from './modules/ubigeo/data/ubigeo-peru.json'
import { createUbigeoControllers } from './modules/ubigeo/controller'
import { JsonUbigeoRepository } from './modules/ubigeo/json-ubigeo.repository'
import type { UbigeoData } from './modules/ubigeo/ubigeo.types'
import { UbigeoService } from './modules/ubigeo/ubigeo.service'
import { createUbigeoV1Controllers } from './modules/ubigeo/v1.controller'

const smtpConfig = getSmtpConfig()
const mailSender = new SmtpMailSender(smtpConfig)

const contactService = new ContactService({
  mailSender,
  from: smtpConfig.from,
  to: smtpConfig.to,
  logger,
})

const ubigeoRepository = new JsonUbigeoRepository(ubigeoJson as UbigeoData)
const ubigeoService = new UbigeoService(ubigeoRepository)

/** Contrato histórico (HTTP 200 siempre). */
export const contactController = createContactController(contactService)
export const ubigeoControllers = createUbigeoControllers(ubigeoService)

/** API versionada con códigos HTTP semánticos. */
export const contactV1Controller = createContactV1Controller(contactService)
export const ubigeoV1Controllers = createUbigeoV1Controllers(ubigeoService)

/** Nitro ya gestiona SIGTERM/SIGINT; aquí solo cerramos recursos propios. */
export async function closeServices(): Promise<void> {
  await mailSender.close()
}
