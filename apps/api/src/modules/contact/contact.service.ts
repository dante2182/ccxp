import { ContactRequestSchema, type ContactResponse } from '@ccxp/contracts'
import { escapeHtml } from '../../shared/escape-html'
import type { MailSender } from './mail-sender'

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

    const body = parsed.data
    const html = this.buildHtml(body)

    try {
      await this.deps.mailSender.send({
        from: `"Formulario Web" <${this.deps.from}>`,
        to: this.deps.to,
        subject: `Nuevo ${body.tipo} - Web`,
        html,
      })
      return { success: true }
    } catch (error) {
      this.deps.logger.error({ err: error }, 'Error enviando correo')
      return { success: false, message: 'Error al enviar correo' }
    }
  }

  private buildHtml(body: ReturnType<typeof ContactRequestSchema.parse>): string {
    const escape = escapeHtml
    const mensaje = escape(body.mensaje).replace(/\r?\n/g, '<br />')

    return `
      <h2>Nuevo contacto desde la web</h2>
      <hr />
      <p><b>Tipo:</b> ${escape(body.tipo)}</p>
      <h3>Datos personales</h3>
      <p><b>Nombre:</b> ${escape(body.nombres)} ${escape(body.apellidos)}</p>
      <p><b>DNI:</b> ${escape(body.dni)}</p>
      <p><b>Empresa:</b> ${escape(body.empresa) || '-'}</p>
      <h3>Contacto</h3>
      <p><b>Teléfono:</b> ${escape(body.telefono)}</p>
      <p><b>Email:</b> ${escape(body.email)}</p>
      <h3>Ubicación</h3>
      <p>${escape(body.departamento)} / ${escape(body.provincia)} / ${escape(body.distrito)}</p>
      <h3>Mensaje</h3>
      <p>${mensaje}</p>
    `
  }
}
