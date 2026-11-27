import type { ContactRequest } from '@ccxp/contracts'
import { escapeHtml } from '../../shared/escape-html'

/** Adaptador de presentación del correo, separado del caso de uso. */
export function buildContactHtml(body: ContactRequest): string {
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
