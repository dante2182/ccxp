import type { LegalDocument } from '~/types/content.types'

type LegalSection = { heading: string; text: string }

export const LEGAL_DOCUMENTS: Record<LegalDocument, { title: string; sections: LegalSection[] }> = {
  terms: {
    title: 'Términos y condiciones',
    sections: [
      {
        heading: '1. Identificación',
        text: 'Este sitio web pertenece a CCIP Telecomunicaciones e Ingeniería, RUC 20559246272, con domicilio en Calle Peral 119, Cercado, Arequipa, Perú. Puede contactarnos en ventas@ccip.com.pe.',
      },
      {
        heading: '2. Uso del sitio',
        text: 'El contenido se ofrece con fines informativos sobre los servicios de telecomunicaciones, redes, seguridad electrónica y energía de CCIP. El usuario se compromete a utilizar el sitio de forma lícita y a no interferir con su funcionamiento.',
      },
      {
        heading: '3. Consultas y cotizaciones',
        text: 'La información del sitio no constituye una oferta comercial vinculante. El alcance, precio, disponibilidad y plazos de cualquier servicio se definirán en una propuesta formal emitida por CCIP y aceptada por ambas partes.',
      },
      {
        heading: '4. Propiedad intelectual',
        text: 'Los textos, diseños, marcas, imágenes y demás contenidos del sitio pertenecen a CCIP o se utilizan con autorización. No se permite su reproducción o uso comercial sin autorización previa, salvo los usos permitidos por ley.',
      },
      {
        heading: '5. Enlaces y disponibilidad',
        text: 'El sitio puede incluir enlaces o servicios de terceros. CCIP no controla sus contenidos ni sus políticas. Procuramos mantener el sitio disponible y actualizado, pero no garantizamos un funcionamiento ininterrumpido o libre de errores.',
      },
      {
        heading: '6. Información técnica',
        text: 'El contenido general del sitio no reemplaza una evaluación técnica específica. Las decisiones sobre un proyecto deben basarse en el diagnóstico y la propuesta correspondientes a cada caso.',
      },
      {
        heading: '7. Cambios y legislación',
        text: 'CCIP puede actualizar estos términos cuando sea necesario. Se aplican las leyes de la República del Perú. Para consultas sobre estas condiciones, escríbanos a ventas@ccip.com.pe.',
      },
    ],
  },
  privacy: {
    title: 'Política de privacidad',
    sections: [
      {
        heading: '1. Responsable',
        text: 'CCIP Telecomunicaciones e Ingeniería, RUC 20559246272, con domicilio en Calle Peral 119, Cercado, Arequipa, Perú, es responsable de la información personal que recibe por sus canales de contacto. Correo: ventas@ccip.com.pe.',
      },
      {
        heading: '2. Información y finalidad',
        text: 'Si nos contacta por correo, teléfono o WhatsApp, podemos tratar los datos que usted proporcione para responder consultas, evaluar requerimientos, preparar propuestas y dar seguimiento a la relación comercial. Solicitamos únicamente información pertinente para esos fines.',
      },
      {
        heading: '3. Formularios de este sitio',
        text: 'En la versión actual, los formularios de contacto y suscripción funcionan únicamente en el navegador: la información ingresada no se transmite ni se guarda en un servidor desde esta página.',
      },
      {
        heading: '4. Almacenamiento local y terceros',
        text: 'El sitio guarda en el almacenamiento local del navegador la preferencia de tema visual. Algunos enlaces o componentes, como mapas y WhatsApp, pueden dirigirle a servicios de terceros que aplican sus propias políticas de privacidad.',
      },
      {
        heading: '5. Conservación y seguridad',
        text: 'La información recibida por nuestros canales se conserva solo durante el tiempo necesario para atender la solicitud y cumplir obligaciones legales. Aplicamos medidas razonables para protegerla; ningún medio de transmisión o almacenamiento puede garantizar seguridad absoluta.',
      },
      {
        heading: '6. Sus derechos',
        text: 'Puede solicitar acceso, actualización, inclusión, rectificación o supresión de sus datos, así como ejercer los demás derechos reconocidos por la normativa peruana de protección de datos personales, escribiendo a ventas@ccip.com.pe. Podremos solicitar información para verificar su identidad.',
      },
      {
        heading: '7. Actualizaciones',
        text: 'Esta política puede modificarse para reflejar cambios en el sitio o en la normativa aplicable. La versión vigente estará disponible en este mismo apartado.',
      },
    ],
  },
}
