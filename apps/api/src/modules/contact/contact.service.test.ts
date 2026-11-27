import type { ContactRequest } from '@ccxp/contracts'
import { describe, expect, it, vi } from 'vitest'
import { ContactService } from './contact.service'
import type { MailMessage, MailSender } from './mail-sender'

class FakeMailSender implements MailSender {
  readonly messages: MailMessage[] = []

  async send(message: MailMessage): Promise<void> {
    this.messages.push(message)
  }

  async close(): Promise<void> {}
}

class FailingMailSender extends FakeMailSender {
  override async send(): Promise<void> {
    throw new Error('SMTP unavailable')
  }
}

const validContact: ContactRequest = {
  tipo: 'Cotización',
  nombres: 'Ana',
  apellidos: 'Pérez',
  dni: '12345678',
  telefono: '987654321',
  email: 'ana@example.com',
  empresa: '',
  mensaje: 'Necesito una cotización de redes.',
  departamento: 'Lima',
  provincia: 'Lima',
  distrito: 'Miraflores',
}

function createService(mailSender: MailSender) {
  return new ContactService({
    mailSender,
    from: 'web@example.com',
    to: 'ventas@example.com',
    logger: { warn: vi.fn(), error: vi.fn() },
  })
}

describe('ContactService', () => {
  it('envía el correo con el asunto y el destinatario esperados', async () => {
    const mailSender = new FakeMailSender()
    const result = await createService(mailSender).send(validContact)

    expect(result).toEqual({ success: true })
    expect(mailSender.messages).toHaveLength(1)
    expect(mailSender.messages[0]?.subject).toBe('Nuevo Cotización - Web')
    expect(mailSender.messages[0]?.to).toBe('ventas@example.com')
  })

  it('escapa HTML en todos los campos del cuerpo', async () => {
    const mailSender = new FakeMailSender()
    await createService(mailSender).send({
      ...validContact,
      nombres: '<script>alert(1)</script>',
      mensaje: 'Hola <b>mundo</b>',
    })

    const html = mailSender.messages[0]?.html ?? ''
    expect(html).not.toContain('<script>')
    expect(html).not.toContain('<b>mundo</b>')
    expect(html).toContain('&lt;script&gt;')
    expect(html).toContain('&lt;b&gt;mundo&lt;/b&gt;')
  })

  it('no envía cuando el payload es inválido', async () => {
    const mailSender = new FakeMailSender()
    const result = await createService(mailSender).send({ ...validContact, dni: '123' })

    expect(result).toEqual({ success: false, message: 'Error al enviar correo' })
    expect(mailSender.messages).toHaveLength(0)
  })

  it('mantiene el contrato de error si el envío falla', async () => {
    const result = await createService(new FailingMailSender()).send(validContact)

    expect(result).toEqual({ success: false, message: 'Error al enviar correo' })
  })
})
