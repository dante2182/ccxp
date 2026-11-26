import nodemailer from 'nodemailer'
import contactConfig from '~/data/contact-config.json'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Leer configuración desde JSON
    const config = contactConfig

    const emailConfig = config.email

    // 🔹 Transportador Nodemailer
    const transporter = nodemailer.createTransport({
      host: emailConfig.smtp.host,
      port: emailConfig.smtp.port,
      secure: emailConfig.smtp.secure,
      auth: {
        user: emailConfig.from,
        pass: emailConfig.appPassword
      }
    } as any)

    // 🔹 Contenido del correo
    const html = `
      <h2>Nuevo contacto desde la web</h2>
      <hr />
      <p><b>Tipo:</b> ${body.tipo}</p>
      <h3>Datos personales</h3>
      <p><b>Nombre:</b> ${body.nombres} ${body.apellidos}</p>
      <p><b>DNI:</b> ${body.dni}</p>
      <p><b>Empresa:</b> ${body.empresa || '-'}</p>
      <h3>Contacto</h3>
      <p><b>Teléfono:</b> ${body.telefono}</p>
      <p><b>Email:</b> ${body.email}</p>
      <h3>Ubicación</h3>
      <p>${body.departamento} / ${body.provincia} / ${body.distrito}</p>
      <h3>Mensaje</h3>
      <p>${body.mensaje}</p>
    `

    // 🔹 Enviar correo
    await transporter.sendMail({
      from: `"Formulario Web" <${emailConfig.from}>`,
      to: emailConfig.to,
      subject: `Nuevo ${body.tipo} - Web`,
      html
    })

    return { success: true }
  } catch (error) {
    console.error('Error enviando correo:', error)
    return { success: false, message: 'Error al enviar correo' }
  }
})
