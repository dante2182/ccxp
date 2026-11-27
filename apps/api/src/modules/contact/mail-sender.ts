export interface MailMessage {
  from: string
  to: string
  subject: string
  html: string
}

/** Señal de timeout del adaptador SMTP, mapeada a HTTP 504 en /api/v1. */
export class MailTimeoutError extends Error {
  constructor() {
    super('Mail delivery timed out')
    this.name = 'MailTimeoutError'
  }
}

/** Frontera de envío de correo; permite usar un fake en pruebas. */
export interface MailSender {
  send(message: MailMessage): Promise<void>
  close(): Promise<void>
}
