import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export type LegalDocument = "privacy" | "terms";

const LEGAL_DOCUMENTS: Record<LegalDocument, { title: string; sections: { heading: string; text: string }[] }> = {
  terms: {
    title: "Términos y condiciones",
    sections: [
      {
        heading: "1. Identificación",
        text: "Este sitio web pertenece a CCIP Telecomunicaciones e Ingeniería, RUC 20559246272, con domicilio en Calle Peral 119, Cercado, Arequipa, Perú. Puede contactarnos en ventas@ccip.com.pe.",
      },
      {
        heading: "2. Uso del sitio",
        text: "El contenido se ofrece con fines informativos sobre los servicios de telecomunicaciones, redes, seguridad electrónica y energía de CCIP. El usuario se compromete a utilizar el sitio de forma lícita y a no interferir con su funcionamiento.",
      },
      {
        heading: "3. Consultas y cotizaciones",
        text: "La información del sitio no constituye una oferta comercial vinculante. El alcance, precio, disponibilidad y plazos de cualquier servicio se definirán en una propuesta formal emitida por CCIP y aceptada por ambas partes.",
      },
      {
        heading: "4. Propiedad intelectual",
        text: "Los textos, diseños, marcas, imágenes y demás contenidos del sitio pertenecen a CCIP o se utilizan con autorización. No se permite su reproducción o uso comercial sin autorización previa, salvo los usos permitidos por ley.",
      },
      {
        heading: "5. Enlaces y disponibilidad",
        text: "El sitio puede incluir enlaces o servicios de terceros. CCIP no controla sus contenidos ni sus políticas. Procuramos mantener el sitio disponible y actualizado, pero no garantizamos un funcionamiento ininterrumpido o libre de errores.",
      },
      {
        heading: "6. Información técnica",
        text: "El contenido general del sitio no reemplaza una evaluación técnica específica. Las decisiones sobre un proyecto deben basarse en el diagnóstico y la propuesta correspondientes a cada caso.",
      },
      {
        heading: "7. Cambios y legislación",
        text: "CCIP puede actualizar estos términos cuando sea necesario. Se aplican las leyes de la República del Perú. Para consultas sobre estas condiciones, escríbanos a ventas@ccip.com.pe.",
      },
    ],
  },
  privacy: {
    title: "Política de privacidad",
    sections: [
      {
        heading: "1. Responsable",
        text: "CCIP Telecomunicaciones e Ingeniería, RUC 20559246272, con domicilio en Calle Peral 119, Cercado, Arequipa, Perú, es responsable de la información personal que recibe por sus canales de contacto. Correo: ventas@ccip.com.pe.",
      },
      {
        heading: "2. Información y finalidad",
        text: "Si nos contacta por correo, teléfono o WhatsApp, podemos tratar los datos que usted proporcione para responder consultas, evaluar requerimientos, preparar propuestas y dar seguimiento a la relación comercial. Solicitamos únicamente información pertinente para esos fines.",
      },
      {
        heading: "3. Formularios de este sitio",
        text: "En la versión actual, los formularios de contacto y suscripción funcionan únicamente en el navegador: la información ingresada no se transmite ni se guarda en un servidor desde esta página.",
      },
      {
        heading: "4. Almacenamiento local y terceros",
        text: "El sitio guarda en el almacenamiento local del navegador la preferencia de tema visual. Algunos enlaces o componentes, como mapas y WhatsApp, pueden dirigirle a servicios de terceros que aplican sus propias políticas de privacidad.",
      },
      {
        heading: "5. Conservación y seguridad",
        text: "La información recibida por nuestros canales se conserva solo durante el tiempo necesario para atender la solicitud y cumplir obligaciones legales. Aplicamos medidas razonables para protegerla; ningún medio de transmisión o almacenamiento puede garantizar seguridad absoluta.",
      },
      {
        heading: "6. Sus derechos",
        text: "Puede solicitar acceso, actualización, inclusión, rectificación o supresión de sus datos, así como ejercer los demás derechos reconocidos por la normativa peruana de protección de datos personales, escribiendo a ventas@ccip.com.pe. Podremos solicitar información para verificar su identidad.",
      },
      {
        heading: "7. Actualizaciones",
        text: "Esta política puede modificarse para reflejar cambios en el sitio o en la normativa aplicable. La versión vigente estará disponible en este mismo apartado.",
      },
    ],
  },
};

export function LegalDialog({ docType, onClose }: { docType: LegalDocument; onClose: () => void }) {
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    closeButton.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      previousFocus?.focus();
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-[#02060e]/70 p-0 backdrop-blur-sm sm:items-center sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={`legal-${docType}-title`}
        className="flex max-h-[88svh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border border-line bg-surface shadow-2xl sm:rounded-2xl"
      >
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-7">
          <div>
            <p className="eyebrow">{docType === "terms" ? "Información legal" : "Datos personales"}</p>
            <h2 id={`legal-${docType}-title`} className="mt-1 text-[1.2rem] font-semibold text-ink sm:text-[1.45rem]">
              {LEGAL_DOCUMENTS[docType].title}
            </h2>
          </div>
          <button
            ref={closeButton}
            type="button"
            onClick={onClose}
            aria-label="Cerrar documento"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-surface-2 text-muted transition-colors hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          <p className="mb-5 text-[0.7rem] text-muted/70">Última actualización: 27 de noviembre de 2026</p>
          <div className="flex flex-col gap-5">
            {LEGAL_DOCUMENTS[docType].sections.map((section) => (
              <section key={section.heading}>
                <h3 className="text-[0.82rem] font-semibold text-ink">{section.heading}</h3>
                <p className="mt-1.5 text-[0.78rem] leading-[1.75] text-muted">{section.text}</p>
              </section>
            ))}
          </div>
        </div>
      </section>
    </div>,
    document.body
  );
}
