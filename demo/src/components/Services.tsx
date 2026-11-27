import { ArrowUpRight, BadgeCheck, ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeading, ServiceIcon } from "./ui";
import { SERVICES } from "@/lib/data";

const certifications = ["Fluke Networks", "OTDR certificado", "Código Nacional de Electricidad", "ISO 9001"];

export function Services({ onQuote }: { onQuote: (service?: string) => void }) {
  return (
    <section
      id="servicios"
      className="relative overflow-hidden pt-5 pb-8 sm:pt-8 sm:pb-12 lg:pt-10 lg:pb-16"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_45%_at_50%_0%,var(--glow-b),transparent_72%)] opacity-70" />
      <div className="container-x">
        <Reveal>
          <SectionHeading
            eyebrow="Nuestros servicios"
            title={
              <>
                Soluciones integrales de <span className="gradient-text">ingeniería</span>
              </>
            }
            description="Un solo proveedor para telecomunicaciones, redes, seguridad y energía: diseño, instalación, certificación y mantenimiento especializado."
          />
        </Reveal>

        <Reveal delay={140}>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5">
            {certifications.map((cert) => (
              <span key={cert} className="inline-flex items-center gap-1.5 text-[0.68rem] font-medium text-muted/80">
                <BadgeCheck className="h-3.5 w-3.5 text-teal/80" strokeWidth={1.9} />
                {cert}
              </span>
            ))}
          </div>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {SERVICES.map((service, index) => (
            <Reveal key={service.id} delay={index * 90} className="h-full">
              <article className="interactive-card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface/70 p-5 shadow-[0_1px_0_0_rgba(255,255,255,0.04)] backdrop-blur-sm transition-all duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2 hover:scale-[1.015] hover:border-accent/45 hover:bg-surface hover:shadow-[var(--shadow-lift)]">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-accent/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

                <div className="flex items-center gap-3">
                  <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-gradient-to-br from-accent/16 to-teal/10 text-accent shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                    <ServiceIcon name={service.icon} className="h-[22px] w-[22px]" strokeWidth={1.6} />
                  </div>
                  <h3 className="min-w-0 flex-1 text-[1rem] font-[650] tracking-[-0.03em] text-ink">{service.title}</h3>
                  <span className="tabular text-[0.62rem] font-semibold tracking-[0.14em] text-muted/50">
                    0{index + 1}
                  </span>
                </div>

                <p className="mt-3 text-[0.78rem] leading-[1.6] text-muted">{service.short}</p>

                <div className="my-4 h-px w-full bg-line" />

                <ul className="flex flex-col gap-2">
                  {service.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[0.78rem] leading-snug text-muted">
                      <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent shadow-[0_0_7px_1px_color-mix(in_oklab,var(--accent)_45%,transparent)]" />
                      {item}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => onQuote(service.slug)}
                  className="link-arrow mt-auto flex items-center pt-4 text-left"
                >
                  Cotizar este servicio
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.1} />
                </button>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-line bg-surface/40 px-6 py-5 backdrop-blur-sm sm:flex-row">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <span className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-teal/25 bg-teal/10 text-teal sm:flex">
                <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
              </span>
              <p className="text-[0.84rem] text-muted">
                <span className="font-semibold text-ink">¿Su proyecto requiere una solución a medida?</span>{" "}
                Integramos varias disciplinas en un solo expediente técnico.
              </p>
            </div>
            <button type="button" onClick={() => onQuote()} className="btn btn-primary group h-10 shrink-0 px-5 text-[0.8rem]">
              Hablemos de su proyecto
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
