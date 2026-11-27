import nodemailer, { type Transporter } from 'nodemailer'
import type SMTPTransport from 'nodemailer/lib/smtp-transport'
import type { SmtpConfig } from '../../config/env'
import { MailTimeoutError, type MailMessage, type MailSender } from './mail-sender'

function isTimeout(error: unknown): boolean {
  if (!(error instanceof Error)) return false
  const code = (error as NodeJS.ErrnoException).code ?? ''
  return code === 'ETIMEDOUT' || code === 'ESOCKET' || /timeout|timed out/i.test(error.message)
}

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
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    }

    this.transporter = nodemailer.createTransport(options)
  }

  async send(message: MailMessage): Promise<void> {
    try {
      await this.transporter.sendMail(message)
    } catch (error) {
      if (isTimeout(error)) throw new MailTimeoutError()
      throw error
    }
  }

  async close(): Promise<void> {
    this.transporter.close()
  }
}
