import nodemailer, { type Transporter } from 'nodemailer'
import type SMTPTransport from 'nodemailer/lib/smtp-transport'
import type { SmtpConfig } from '../../config/env'
import type { MailMessage, MailSender } from './mail-sender'

/** Implementación real de MailSender usando SMTP. */
export class SmtpMailSender implements MailSender {
  private readonly transporter: Transporter<SMTPTransport.SentMessageInfo>

  constructor(config: SmtpConfig) {
    const options: SMTPTransport.Options = {
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.password,
      },
    }

    this.transporter = nodemailer.createTransport(options)
  }

  async send(message: MailMessage): Promise<void> {
    await this.transporter.sendMail(message)
  }

  async close(): Promise<void> {
    this.transporter.close()
  }
}
