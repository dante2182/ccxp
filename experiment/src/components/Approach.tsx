import { useState } from "react";
import { ArrowRight, Check, MapPin, Activity, Headphones, Phone, ShieldCheck, Sparkles } from "lucide-react";
import { Reveal } from "./Reveal";
import { CAPABILITIES, CONTACT, type Capability } from "@/lib/data";
import { cn } from "@/utils/cn";

const capabilityToService: Record<string, string> = {
  fibra: "Telecomunicaciones",
  "5g": "Telecomunicaciones",
  seguridad: "Seguridad electrónica",
  energia: "Energía eléctrica",
};

const capabilityIcons = {
  fibra: Activity,
  "5g": Sparkles,
  seguridad: ShieldCheck,
  energia: Headphones,
} as const;

export function Approach({ onQuote }: { onQuote: (service?: string) => void }) {
  const [activeId, setActiveId] = useState(CAPABILITIES[0].id);
  const active: Capability = CAPABILITIES.find((c) => c.id === activeId) ?? CAPABILITIES[0];

  return (
    <section
      id="capacidades"
      className="relative overflow-hidden border-y border-line bg-bg-deep/45 pt-5 pb-8 sm:pt-8 sm:pb-12 lg:pt-10 lg:pb-16"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_40%_at_82%_12%,var(--glow-a),transparent_70%)] opacity-60" />
      <div className="container-x">
        <div>
          <Reveal className="flex flex-col items-center text-center">
            <div className="eyebrow">
              <span className="h-1.5 w-1.5 rounded-full bg-teal shadow-[0_0_10px_2px_color-mix(in_oklab,var(--accent)_35%,transparent)]" />
              Capacidades
            </div>
            <h2 className="mt-5 max-w-[22ch] text-[2.15rem] font-[700] leading-[1.03] tracking-[-0.048em] text-ink sm:text-[2.9rem] lg:text-[3.4rem]">
              Cada capa de la red, <span className="gradient-text">resuelta con precisión.</span>
            </h2>
          </Reveal>
        </div>

        <Reveal delay={80}>
          <div className="mt-10 grid grid-cols-2 gap-1.5 rounded-2xl border border-line bg-surface/60 p-1.5 backdrop-blur-md sm:grid-cols-4">
            {CAPABILITIES.map((cap) => {
              const Icon = capabilityIcons[cap.id as keyof typeof capabilityIcons] ?? Activity;
              const isActive = activeId === cap.id;
              return (
                <button
                  key={cap.id}
                  type="button"
                  onClick={() => setActiveId(cap.id)}
                  aria-pressed={isActive}
                  className={cn(
                    "group/tab relative flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-[0.78rem] font-semibold transition-all duration-300 sm:px-4",
                    isActive
                      ? "bg-surface text-ink shadow-[0_4px_18px_-6px_rgba(2,12,27,0.4)] ring-1 ring-line"
                      : "text-muted hover:-translate-y-0.5 hover:bg-surface/75 hover:text-ink hover:shadow-[0_8px_18px_-12px_rgba(10,31,68,0.45)]"
                  )}
                >
                  <Icon className={cn("h-3.5 w-3.5 transition-transform duration-300 group-hover/tab:scale-110", isActive ? "text-accent" : "text-muted/70")} strokeWidth={2} />
                  {cap.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        <div className="mt-6 grid gap-6 lg:mt-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-stretch">
          <Reveal className="h-full">
            <div className="group relative h-full min-h-[250px] overflow-hidden rounded-3xl border border-line bg-surface-2 sm:min-h-[320px] lg:min-h-[340px]">
              <img
                key={active.image}
                src={active.image}
                alt={active.imageAlt}
                loading="lazy"
                className="absolute inset-0 h-full w-full animate-rise object-cover transition-transform duration-[1400ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020a13]/85 via-[#020a13]/15 to-transparent" />
              <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4 sm:p-5">
                <span className="rounded-full border border-white/20 bg-black/25 px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-white/90 backdrop-blur-md">
                  {active.eyebrow}
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/25 px-2.5 py-1.5 text-[0.6rem] font-medium text-white/80 backdrop-blur-md">
                  <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-teal" />
                  Proyecto verificado
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-6">
                <div>
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-teal">
                    Capacidad 0{CAPABILITIES.findIndex((c) => c.id === active.id) + 1}
                  </p>
                  <p className="mt-1 text-[0.92rem] font-medium text-white sm:text-[1.02rem]">{active.label}</p>
                </div>
                <div className="hidden items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[0.62rem] text-white/90 backdrop-blur-md sm:flex">
                  <MapPin className="h-3 w-3" />
                  Arequipa, Perú
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120} className="h-full">
            <div key={active.id} className="panel animate-rise flex h-full flex-col p-4 sm:p-5">
              <span className="eyebrow">{active.eyebrow}</span>
              <h3 className="mt-1.5 text-[1.25rem] font-[680] leading-[1.12] tracking-[-0.04em] text-ink sm:text-[1.45rem]">
                {active.title}
              </h3>
              <p className="mt-1.5 text-[0.76rem] leading-[1.55] text-muted">{active.description}</p>

              <ul className="mt-3 flex flex-col gap-1.5">
                {active.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2 text-[0.75rem] leading-tight text-muted">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-teal/12 text-teal">
                      <Check className="h-2.5 w-2.5" strokeWidth={3} />
                    </span>
                    {bullet}
                  </li>
                ))}
              </ul>

              <div className="mt-auto grid grid-cols-3 gap-2 border-t border-line pt-3 sm:mt-3">
                {active.metrics.map((metric) => (
                  <div key={metric.label}>
                    <p className="tabular text-[1.05rem] font-[700] tracking-[-0.03em] text-ink sm:text-[1.2rem]">
                      {metric.value}
                    </p>
                    <p className="mt-1 text-[0.6rem] leading-tight text-muted/85">{metric.label}</p>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => onQuote(capabilityToService[active.id])}
                className="link-arrow mt-3 w-fit"
              >
                Solicitar evaluación técnica
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
              </button>
            </div>
          </Reveal>
        </div>

        <div className="mt-8 grid gap-5 sm:mt-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-stretch">
          <div className="flex flex-col gap-4">
            <Reveal delay={60}>
              <div className="panel flex flex-col gap-3 p-5 sm:p-6">
                <div className="eyebrow">
                  <Sparkles className="h-3.5 w-3.5 text-accent" />
                  Ingeniería aplicada
                </div>
                <p className="text-[0.98rem] font-semibold leading-[1.4] tracking-[-0.02em] text-ink sm:text-[1.08rem]">
                  No ensamblamos equipos: diseñamos infraestructura.
                </p>
                <p className="text-[0.76rem] leading-[1.65] text-muted sm:text-[0.8rem]">
                  Explore las capacidades técnicas que nuestro equipo ejecuta en campo, con documentación,
                  certificación y soporte posterior.
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="chip">
                    <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-teal" />
                    NOC con monitoreo 24/7
                  </span>
                  <span className="chip">
                    <MapPin className="h-3 w-3 text-accent" />
                    Arequipa, Perú
                  </span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-line bg-surface/40 px-5 py-4">
                <div>
                  <p className="text-[0.72rem] font-semibold text-ink">¿Emergencia operativa?</p>
                  <p className="mt-0.5 text-[0.66rem] text-muted">Atención técnica prioritaria 24/7</p>
                </div>
                <a
                  href={`tel:${CONTACT.phoneHref}`}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-orange/30 bg-orange/10 text-orange transition-transform hover:scale-105"
                  aria-label="Llamar a soporte técnico"
                >
                  <Phone className="h-4 w-4" />
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={180} className="h-full">
            <div className="relative h-full min-h-[430px] overflow-hidden rounded-3xl border border-line">
              <img
                src="https://images.pexels.com/photos/17489163/pexels-photo-17489163.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=800&w=1800"
                alt="Sala de servidores del centro de operaciones de red"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#020a15] via-[#020a15]/90 to-[#020a15]/25" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,10,21,0.35),transparent_40%)]" />
              <div className="relative z-10 flex h-full flex-col justify-between gap-6 p-6 sm:p-8">
                <div className="max-w-[580px]">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 backdrop-blur-md">
                    <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-teal" />
                    <span className="text-[0.6rem] font-semibold uppercase tracking-[0.17em] text-white/85">
                      Centro de operaciones · CCIP
                    </span>
                  </div>
                  <h3 className="mt-4 text-[1.85rem] font-[700] leading-[1.08] tracking-[-0.045em] text-white sm:text-[2.3rem]">
                    Su red, monitoreada las 24 horas.
                  </h3>
                  <p className="mt-3 max-w-[48ch] text-[0.86rem] leading-[1.7] text-white/70 sm:text-[0.92rem]">
                    Nuestro equipo de soporte detecta y atiende incidencias antes de que afecten su operación. Cada
                    evento queda registrado en un historial técnico auditable.
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <button type="button" onClick={() => onQuote()} className="btn btn-accent group h-11 px-5">
                      Conocer el soporte
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                    <a
                      href="#contacto"
                      className="btn h-11 border border-white/20 bg-white/[0.06] px-5 text-white backdrop-blur-md hover:bg-white/[0.12]"
                    >
                      Hablar con un ingeniero
                    </a>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 border-t border-white/15 pt-5 sm:gap-6">
                  {[
                    { v: "24/7", l: "Monitoreo continuo" },
                    { v: "< 4 h", l: "Respuesta en campo" },
                    { v: "0", l: "Incidencias abiertas" },
                  ].map((m) => (
                    <div key={m.l}>
                      <p className="tabular text-[1.35rem] font-[700] tracking-[-0.04em] text-white sm:text-[1.6rem]">{m.v}</p>
                      <p className="mt-1 text-[0.58rem] uppercase leading-tight tracking-[0.1em] text-white/55">{m.l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>

      </div>
    </section>
  );
}
