import type { ContactRequest } from '@ccxp/contracts'
import { describe, expect, it, vi } from 'vitest'
import { HttpError } from '../../shared/http-error'
import { ContactService } from './contact.service'
import { MailTimeoutError, type MailMessage, type MailSender } from './mail-sender'

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

class TimeoutMailSender extends FakeMailSender {
  override async send(): Promise<void> {
    throw new MailTimeoutError()
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

async function statusOf(promise: Promise<unknown>): Promise<number | undefined> {
  try {
    await promise
    return undefined
  } catch (error) {
    return error instanceof HttpError ? error.status : undefined
  }
}

describe('ContactService.sendStrict', () => {
  it('devuelve success:true con un payload válido', async () => {
    const mailSender = new FakeMailSender()
    await expect(createService(mailSender).sendStrict(validContact)).resolves.toEqual({
      success: true,
    })
    expect(mailSender.messages).toHaveLength(1)
  })

  it('lanza 422 con un payload inválido', async () => {
    const mailSender = new FakeMailSender()
    expect(
      await statusOf(createService(mailSender).sendStrict({ ...validContact, dni: '123' })),
    ).toBe(422)
    expect(mailSender.messages).toHaveLength(0)
  })

  it('lanza 500 si el envío falla por un error interno', async () => {
    expect(await statusOf(createService(new FailingMailSender()).sendStrict(validContact))).toBe(
      500,
    )
  })

  it('lanza 504 si el adaptador SMTP agota el timeout', async () => {
    expect(await statusOf(createService(new TimeoutMailSender()).sendStrict(validContact))).toBe(
      504,
    )
  })
})
