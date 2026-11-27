export interface MailMessage {
  from: string
  to: string
  subject: string
  html: string
}

/** Frontera de envío de correo; permite usar un fake en pruebas. */
export interface MailSender {
  send(message: MailMessage): Promise<void>
  close(): Promise<void>
}
