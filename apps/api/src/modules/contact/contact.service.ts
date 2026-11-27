import { ContactRequestSchema, type ContactRequest, type ContactResponse } from '@ccxp/contracts'
import { HttpError } from '../../shared/http-error'
import { buildContactHtml } from './email-template'
import { MailTimeoutError, type MailSender } from './mail-sender'

export interface ContactLogger {
  warn: (data: Record<string, unknown>, message: string) => void
  error: (data: Record<string, unknown>, message: string) => void
}

export interface ContactServiceDeps {
  mailSender: MailSender
  from: string
  to: string
  logger: ContactLogger
}

/** Caso de uso del formulario: valida, compone el correo y delega el envío. */
export class ContactService {
  constructor(private readonly deps: ContactServiceDeps) {}

  /** Contrato histórico: siempre HTTP 200, con success:false ante cualquier fallo. */
  async send(rawBody: unknown): Promise<ContactResponse> {
    const parsed = ContactRequestSchema.safeParse(rawBody)

    if (!parsed.success) {
      this.deps.logger.warn(
        {
          issues: parsed.error.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
          })),
        },
        'Invalid contact payload',
      )
      return { success: false, message: 'Error al enviar correo' }
    }

    try {
      await this.dispatch(parsed.data)
      return { success: true }
    } catch (error) {
      this.deps.logger.error({ err: error }, 'Error enviando correo')
      return { success: false, message: 'Error al enviar correo' }
    }
  }

  /** Contrato v1: errores semánticos (422 / 504 / 500). */
  async sendStrict(rawBody: unknown): Promise<ContactResponse> {
    const parsed = ContactRequestSchema.safeParse(rawBody)

    if (!parsed.success) {
      const detail = parsed.error.issues
        .map((issue) => `${issue.path.join('.') || 'body'}: ${issue.message}`)
        .join('; ')
      throw new HttpError(422, 'Payload inválido', detail)
    }

    try {
      await this.dispatch(parsed.data)
      return { success: true }
    } catch (error) {
      this.deps.logger.error({ err: error }, 'Error enviando correo')
      if (error instanceof MailTimeoutError) {
        throw new HttpError(504, 'Timeout al enviar el correo')
      }
      throw new HttpError(500, 'Error interno al enviar el correo')
    }
  }

  private async dispatch(body: ContactRequest): Promise<void> {
    await this.deps.mailSender.send({
      from: `"Formulario Web" <${this.deps.from}>`,
      to: this.deps.to,
      subject: `Nuevo ${body.tipo} - Web`,
      html: buildContactHtml(body),
    })
  }
}
