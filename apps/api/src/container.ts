import { getSmtpConfig } from './config/env'
import { logger } from './config/logger'
import { createContactController } from './modules/contact/controller'
import { ContactService } from './modules/contact/contact.service'
import { SmtpMailSender } from './modules/contact/smtp-mail-sender'
import ubigeoJson from './modules/ubigeo/data/ubigeo-peru.json'
import { createUbigeoControllers } from './modules/ubigeo/controller'
import { JsonUbigeoRepository } from './modules/ubigeo/json-ubigeo.repository'
import type { UbigeoData } from './modules/ubigeo/ubigeo.types'
import { UbigeoService } from './modules/ubigeo/ubigeo.service'

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

export const contactController = createContactController(contactService)
export const ubigeoControllers = createUbigeoControllers(ubigeoService)

/** Nitro ya gestiona SIGTERM/SIGINT; aquí solo cerramos recursos propios. */
export async function closeServices(): Promise<void> {
  await mailSender.close()
}
