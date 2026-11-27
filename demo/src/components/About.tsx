import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { CAPABILITIES, PROCESS } from "@/lib/data";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./ui";

const processSummaries = [
  "Revisamos la infraestructura y los requerimientos en campo.",
  "Definimos planos, equipos, plazos y presupuesto.",
  "Instalamos con seguridad y mínima interrupción.",
  "Documentamos, certificamos y capacitamos al equipo.",
];

const processDetails: Record<string, string[]> = {
  "01": ["Visita técnica a la sede", "Medición de la infraestructura existente", "Levantamiento de los requerimientos de operación"],
  "02": ["Elaboración de planos y memoria de cálculo", "Selección y especificación de equipos", "Cronograma de trabajo y presupuesto"],
  "03": ["Ejecución con protocolos de seguridad", "Supervisión durante la implementación", "Coordinación para reducir interrupciones"],
  "04": ["Certificación de los tramos instalados", "Documentación técnica del proyecto", "Capacitación al equipo para el soporte"],
};

export function About() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const closeStageButton = useRef<HTMLButtonElement>(null);
  const activeCapability = CAPABILITIES[activeSlide];
  const stageDialogOpen = selectedStage !== null;

  const changeSlide = (direction: number) => {
    setActiveSlide((current) => (current + direction + CAPABILITIES.length) % CAPABILITIES.length);
  };

  useEffect(() => {
    if (!stageDialogOpen) return;
    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedStage(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    closeStageButton.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      previousFocus?.focus();
    };
  }, [stageDialogOpen]);

  return (
    <>
      <section
        id="nosotros"
        className="relative isolate overflow-hidden border-y border-line bg-bg-deep/45 pt-5 pb-12 sm:pt-8 sm:pb-16 lg:pt-10 lg:pb-20"
      >
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_45%_at_12%_12%,var(--glow-a),transparent_72%)] opacity-45" />
        <div className="container-x">
        <div className="grid gap-4 md:grid-cols-[1fr_0.8fr] md:items-end">
          <Reveal>
            <SectionHeading
              eyebrow="Nosotros"
              title={
                <>
                  Ingeniería que acompaña <span className="gradient-text">cada etapa.</span>
                </>
              }
              align="left"
            />
          </Reveal>
          <Reveal delay={70}>
            <p className="max-w-[48ch] border-l border-accent/30 pl-4 text-[0.82rem] leading-[1.7] text-muted md:mb-1">
              Diseñamos, implementamos y damos soporte a infraestructura tecnológica para empresas, desde el
              diagnóstico hasta la operación.
            </p>
          </Reveal>
        </div>

        <div className="mt-8 grid gap-4 sm:mt-9 md:grid-cols-[0.92fr_1.08fr] md:items-stretch lg:mt-10 lg:gap-5">
          <Reveal className="md:h-full">
            <div
              role="group"
              aria-roledescription="carrusel"
              aria-label="Capacidades de CCIP"
              className="group relative h-[250px] overflow-hidden rounded-3xl border border-line bg-surface-2 shadow-[var(--shadow-card)] sm:h-[310px] md:h-full md:min-h-[350px]"
            >
              <img
                key={activeCapability.id}
                src={activeCapability.image}
                alt={activeCapability.imageAlt}
                loading="lazy"
                className="absolute inset-0 h-full w-full animate-rise object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020a13]/85 via-transparent to-[#020a13]/10" />
              <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/25 px-3 py-1.5 text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-white/85 backdrop-blur-md">
                CCIP · Ingeniería
              </span>
              <button
                type="button"
                onClick={() => changeSlide(-1)}
                aria-label="Imagen anterior"
                className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => changeSlide(1)}
                aria-label="Imagen siguiente"
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/25 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
                <div aria-live="polite">
                  <p className="text-[0.56rem] font-semibold uppercase tracking-[0.14em] text-teal">
                    Capacidad técnica
                  </p>
                  <p className="mt-1 text-[0.82rem] font-semibold text-white">{activeCapability.label}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  {CAPABILITIES.map((capability, index) => (
                    <button
                      key={capability.id}
                      type="button"
                      onClick={() => setActiveSlide(index)}
                      aria-label={`Mostrar ${capability.label}`}
                      aria-current={activeSlide === index ? "true" : undefined}
                      className={`h-1.5 rounded-full transition-all ${
                        activeSlide === index ? "w-5 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={90} className="md:h-full">
            <div className="h-full rounded-3xl border border-line bg-surface/60 p-4 shadow-[var(--shadow-card)] sm:p-5">
              <div className="flex items-end justify-between gap-3 border-b border-line pb-3">
                <div>
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-accent">
                    Cómo trabajamos
                  </p>
                  <h3 className="mt-1 text-[1.08rem] font-semibold tracking-[-0.02em] text-ink">
                    Un proceso en cuatro etapas
                  </h3>
                </div>
                <span className="shrink-0 rounded-full border border-line bg-surface-2 px-2.5 py-1 text-[0.58rem] font-medium text-muted">
                  01 — 04
                </span>
              </div>

              <div className="mt-3 grid gap-2">
                {PROCESS.map((stage, index) => (
                  <button
                    key={stage.step}
                    type="button"
                    onClick={() => setSelectedStage(index)}
                    aria-label={`Ver detalles de ${stage.title}`}
                    aria-haspopup="dialog"
                    className="group/stage relative flex w-full items-start gap-3 rounded-xl border border-line/80 bg-bg/25 px-3 py-2.5 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/35 hover:bg-surface/55 hover:shadow-[var(--shadow-card)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-accent/20 bg-accent/[0.06] text-[0.62rem] font-bold text-accent transition-all duration-300 group-hover/stage:scale-110 group-hover/stage:rotate-3 group-hover/stage:bg-accent/12">
                      {stage.step}
                    </span>
                    <span className="flex-1 pt-0.5">
                      <span className="block text-[0.8rem] font-semibold text-ink">{stage.title}</span>
                      <span className="mt-0.5 block text-[0.68rem] leading-[1.45] text-muted">{processSummaries[index]}</span>
                    </span>
                    <ArrowUpRight className="mt-1 h-3.5 w-3.5 shrink-0 text-muted/60 transition-all duration-300 group-hover/stage:translate-x-0.5 group-hover/stage:-translate-y-0.5 group-hover/stage:text-accent" />
                  </button>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
        </div>
      </section>

      {selectedStage !== null &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-end justify-center bg-[#02060e]/70 p-0 backdrop-blur-sm sm:items-center sm:p-5"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setSelectedStage(null);
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="process-stage-title"
              className="w-full max-w-xl overflow-hidden rounded-t-2xl border border-line bg-surface shadow-2xl sm:rounded-2xl"
            >
              <div className="flex items-start gap-4 border-b border-line p-5 sm:p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-accent/25 bg-accent/[0.08] text-[0.8rem] font-bold text-accent">
                  {PROCESS[selectedStage].step}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-accent">
                    Etapa {selectedStage + 1} de {PROCESS.length}
                  </p>
                  <h2 id="process-stage-title" className="mt-1 text-[1.2rem] font-semibold tracking-[-0.025em] text-ink">
                    {PROCESS[selectedStage].title}
                  </h2>
                </div>
                <button
                  ref={closeStageButton}
                  type="button"
                  onClick={() => setSelectedStage(null)}
                  aria-label="Cerrar detalles de la etapa"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-surface-2 text-muted transition-colors hover:text-ink"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-5 sm:p-6">
                <p className="text-[0.84rem] leading-[1.7] text-muted">{PROCESS[selectedStage].text}</p>
                <div className="mt-5 rounded-xl border border-line bg-surface-2/45 p-4">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-ink">
                    En esta etapa
                  </p>
                  <ul className="mt-3 flex flex-col gap-2.5">
                    {processDetails[PROCESS[selectedStage].step].map((detail) => (
                      <li key={detail} className="flex items-start gap-2.5 text-[0.78rem] leading-[1.55] text-muted">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-line px-5 py-4 sm:px-6">
                <button
                  type="button"
                  onClick={() => setSelectedStage((current) => (current === null ? null : Math.max(0, current - 1)))}
                  disabled={selectedStage === 0}
                  className="inline-flex items-center gap-1.5 text-[0.75rem] font-medium text-muted transition-colors hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedStage((current) => (current === null ? null : Math.min(PROCESS.length - 1, current + 1)))
                  }
                  disabled={selectedStage === PROCESS.length - 1}
                  className="inline-flex items-center gap-1.5 text-[0.75rem] font-semibold text-accent transition-colors hover:text-teal disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </section>
          </div>,
          document.body
        )}
    </>
  );
}
