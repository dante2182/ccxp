import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Loader2,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { CONTACT, SERVICES } from "@/lib/data";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./ui";
import { cn } from "@/utils/cn";

type FormState = {
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  servicio: string;
  mensaje: string;
  acepta: boolean;
};

const EMPTY_FORM: FormState = {
  nombre: "",
  empresa: "",
  email: "",
  telefono: "",
  servicio: "",
  mensaje: "",
  acepta: false,
};

type Errors = Partial<Record<keyof FormState, string>>;

export function Contact({ preselect }: { preselect?: string }) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [folio, setFolio] = useState("");
  const timer = useRef<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const value = SERVICES.some((s) => s.slug === preselect)
      ? (preselect as string)
      : preselect
        ? "Otra solución / asesoría a medida"
        : "";
    if (value) {
      setSubmitted(false);
      setForm((current) => ({ ...current, servicio: value }));
    }
  }, [preselect]);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    []
  );

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const validate = () => {
    const next: Errors = {};
    if (form.nombre.trim().length < 3) next.nombre = "Ingrese su nombre completo.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) next.email = "Ingrese un correo válido.";
    if (!form.servicio) next.servicio = "Seleccione un servicio de interés.";
    if (form.mensaje.trim().length < 10) next.mensaje = "Cuéntenos brevemente su necesidad (mín. 10 caracteres).";
    if (!form.acepta) next.acepta = "Necesitamos su consentimiento para contactarlo.";
    return next;
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      const firstKey = Object.keys(next)[0];
      document.getElementById(`field-${firstKey}`)?.focus();
      return;
    }
    setLoading(true);
    timer.current = window.setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFolio(`CCIP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 8999)}`);
    }, 1100);
  };

  const projectCard = (
    <Reveal delay={180}>
      <div className="relative overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/[0.1] via-teal/[0.05] to-transparent p-5">
        <div className="pointer-events-none absolute -right-6 -top-8 h-28 w-28 rounded-full bg-accent/10 blur-2xl" />
        <div className="relative flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/12 text-accent">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <p className="text-[0.85rem] font-semibold tracking-[-0.02em] text-ink">Coordinación de proyectos</p>
        </div>
        <p className="relative mt-2.5 text-[0.76rem] leading-[1.7] text-muted">
          Compártanos el alcance de su requerimiento; el equipo de CCIP se pondrá en contacto para coordinar la
          atención según el servicio que necesita.
        </p>
        <div className="relative mt-3 flex items-center gap-1.5 text-[0.66rem] font-medium text-teal">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Seguimiento por el equipo de CCIP
        </div>
      </div>
    </Reveal>
  );
  return (
    <section
      id="contacto"
      className="relative overflow-hidden border-t border-line bg-bg-deep/40 pt-5 pb-8 sm:pt-8 sm:pb-12 lg:pt-10 lg:pb-16"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_45%_at_50%_0%,var(--glow-b),transparent_72%)]" />
      <div className="pointer-events-none absolute -right-24 bottom-10 -z-10 h-[320px] w-[320px] rounded-full bg-accent/8 blur-[100px]" />
      <div className="container-x">
        <Reveal>
          <SectionHeading
            eyebrow="Contáctenos"
            title={
              <>
                Solicite su cotización <span className="gradient-text">gratuita</span>
              </>
            }
            description="Cuéntenos sobre su proyecto y un ingeniero de CCIP se pondrá en contacto para conocer sus requerimientos y coordinar una propuesta técnica."
          />
        </Reveal>

        <div className="mt-11 grid gap-4 lg:grid-cols-[0.88fr_1.32fr] lg:gap-5">
          <div className="flex flex-col gap-4">
            <Reveal delay={100} className={cn(!isExpanded && "h-full")}>
              <div className={cn("panel p-5 sm:p-6", !isExpanded && "h-full")}>
                <h3 className="text-[0.98rem] font-semibold tracking-[-0.02em] text-ink">Información de contacto</h3>
                <div className="mt-5 flex flex-col gap-4">
                  {[
                    { icon: MapPin, label: "Dirección", value: CONTACT.address, href: undefined },
                    { icon: Phone, label: "Teléfono", value: CONTACT.phone, href: `tel:${CONTACT.phoneHref}` },
                    { icon: Mail, label: "Correo", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
                    { icon: Clock, label: "Horario de atención", value: CONTACT.hours, href: undefined },
                  ].map((item) => (
                    <div key={item.label} className="group flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-accent/20 bg-accent/8 text-accent transition-colors group-hover:bg-accent/12">
                        <item.icon className="h-4 w-4" strokeWidth={1.7} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[0.72rem] font-semibold text-ink">{item.label}</p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="mt-0.5 block break-words text-[0.75rem] text-muted transition-colors hover:text-accent"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="mt-0.5 text-[0.75rem] leading-relaxed text-muted">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <a
                  href={CONTACT.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#22c55e] text-[0.82rem] font-semibold text-white shadow-[0_12px_26px_-14px_rgba(34,197,94,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1db154]"
                >
                  <MessageCircle className="h-[18px] w-[18px]" strokeWidth={2} />
                  Escribir por WhatsApp
                </a>

                <div className="mt-5 border-t border-line pt-4">
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-muted/70">Cobertura</p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {["Arequipa", "Lima", "Cusco", "Puno", "Moquegua", "Tacna"].map((city) => (
                      <span
                        key={city}
                        className="rounded-md border border-line bg-surface-2/60 px-2 py-1 text-[0.64rem] font-medium text-muted"
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
            {isExpanded && (
              <div className="flex flex-col gap-4">
                {projectCard}
              </div>
            )}
          </div>

          <Reveal delay={140} className="h-full">
            {submitted ? (
              <div className={cn("panel p-5 sm:p-8", !isExpanded && "h-full")}>
              <div className="animate-rise flex min-h-[420px] flex-col items-center justify-center py-8 text-center">
                  <div className="relative">
                    <div className="absolute inset-0 animate-ping rounded-full bg-accent/15" />
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent">
                      <CheckCircle2 className="h-8 w-8" strokeWidth={1.7} />
                    </div>
                  </div>
                  <h3 className="mt-6 text-[1.5rem] font-[680] tracking-[-0.035em] text-ink">Solicitud recibida</h3>
                  <p className="mt-2 max-w-[38ch] text-[0.85rem] leading-relaxed text-muted">
                    Gracias, <span className="font-semibold text-ink">{form.nombre.split(" ")[0]}</span>. Un ingeniero
                    revisará su requerimiento y se contactará con usted en menos de 24 horas hábiles.
                  </p>
                  <div className="mt-5 flex flex-col items-center gap-1.5 rounded-xl border border-line bg-surface-2/60 px-5 py-3">
                    <span className="text-[0.6rem] uppercase tracking-[0.16em] text-muted">Folio de solicitud</span>
                    <span className="tabular text-[0.92rem] font-semibold tracking-[0.04em] text-ink">{folio}</span>
                  </div>
                  <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setForm(EMPTY_FORM);
                        setIsExpanded(false);
                      }}
                      className="btn btn-ghost h-11 px-5"
                    >
                      Enviar otra solicitud
                    </button>
                    <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="btn btn-primary h-11 px-5">
                      <MessageCircle className="h-4 w-4" />
                      Escribir por WhatsApp
                    </a>
                  </div>
              </div>
            </div>
            ) : (
              <div className={cn("panel p-5 sm:p-8", !isExpanded && "h-full")}>
                <form onSubmit={onSubmit} noValidate>
                  <div className="mb-6 flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-[1.02rem] font-semibold tracking-[-0.025em] text-ink">Formulario de contacto</h3>
                      <p className="mt-1 text-[0.73rem] text-muted">Los campos marcados con * son obligatorios.</p>
                    </div>
                    <span className="hidden items-center gap-1.5 rounded-full border border-accent/25 bg-accent/[0.08] px-2.5 py-1.5 text-[0.6rem] font-semibold text-accent sm:inline-flex">
                      <ShieldCheck className="h-3 w-3" />
                      Datos protegidos
                    </span>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor="field-nombre" className="field-label">
                        Nombre completo *
                      </label>
                      <input
                        id="field-nombre"
                        name="nombre"
                        type="text"
                        autoComplete="name"
                        value={form.nombre}
                        onChange={(e) => update("nombre", e.target.value)}
                        placeholder="Ej. Carlos Rodríguez"
                        aria-invalid={Boolean(errors.nombre)}
                        aria-describedby={errors.nombre ? "error-nombre" : undefined}
                        className="input"
                      />
                      {errors.nombre && (
                        <p id="error-nombre" className="mt-1.5 text-[0.68rem] text-rose-500">
                          {errors.nombre}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="field-empresa" className="field-label">
                        Empresa
                      </label>
                      <input
                        id="field-empresa"
                        name="empresa"
                        type="text"
                        autoComplete="organization"
                        value={form.empresa}
                        onChange={(e) => update("empresa", e.target.value)}
                        placeholder="Nombre de su empresa"
                        className="input"
                      />
                    </div>
                    <div>
                      <label htmlFor="field-telefono" className="field-label">
                        Teléfono
                      </label>
                      <input
                        id="field-telefono"
                        name="telefono"
                        type="tel"
                        autoComplete="tel"
                        inputMode="tel"
                        value={form.telefono}
                        onChange={(e) => update("telefono", e.target.value)}
                        placeholder="+51 999 999 999"
                        className="input"
                      />
                    </div>
                  </div>

                  <div
                    id="additional-request-fields"
                    hidden={!isExpanded}
                    className={cn(isExpanded && "animate-rise")}
                  >
                      <div className="mt-4">
                        <label htmlFor="field-email" className="field-label">
                          Correo corporativo *
                        </label>
                        <input
                          id="field-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          value={form.email}
                          onChange={(e) => update("email", e.target.value)}
                          placeholder="nombre@empresa.com"
                          aria-invalid={Boolean(errors.email)}
                          aria-describedby={errors.email ? "error-email" : undefined}
                          className="input"
                        />
                        {errors.email && (
                          <p id="error-email" className="mt-1.5 text-[0.68rem] text-rose-500">
                            {errors.email}
                          </p>
                        )}
                      </div>

                  <div className="mt-4">
                    <label htmlFor="field-servicio" className="field-label">
                      Servicio de interés *
                    </label>
                    <div className="relative">
                      <select
                        id="field-servicio"
                        name="servicio"
                        value={form.servicio}
                        onChange={(e) => update("servicio", e.target.value)}
                        aria-invalid={Boolean(errors.servicio)}
                        aria-describedby={errors.servicio ? "error-servicio" : undefined}
                        className={cn("appearance-none pr-10", !form.servicio && "text-muted")}
                      >
                        <option value="">Seleccione un servicio</option>
                        {SERVICES.map((service) => (
                          <option key={service.id} value={service.slug}>
                            {service.title}
                          </option>
                        ))}
                        <option value="Otra solución / asesoría a medida">Otra solución / asesoría a medida</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                    </div>
                    {errors.servicio && (
                      <p id="error-servicio" className="mt-1.5 text-[0.68rem] text-rose-500">
                        {errors.servicio}
                      </p>
                    )}
                    </div>

                  <div className="mt-4">
                    <label htmlFor="field-mensaje" className="field-label">
                      Mensaje *
                    </label>
                    <textarea
                      id="field-mensaje"
                      name="mensaje"
                      rows={5}
                      value={form.mensaje}
                      onChange={(e) => update("mensaje", e.target.value)}
                      placeholder="Describa brevemente su proyecto o necesidad técnica..."
                      aria-invalid={Boolean(errors.mensaje)}
                      aria-describedby={errors.mensaje ? "error-mensaje" : undefined}
                      className="input resize-none"
                    />
                    <div className="mt-1.5 flex items-center justify-between gap-3">
                      {errors.mensaje ? (
                        <p id="error-mensaje" className="text-[0.68rem] text-rose-500">
                          {errors.mensaje}
                        </p>
                      ) : (
                        <span />
                      )}
                      <span className="text-[0.64rem] text-muted/70">{form.mensaje.length}/800</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label
                      htmlFor="field-acepta"
                      className="flex cursor-pointer items-start gap-2.5 text-[0.72rem] leading-relaxed text-muted"
                    >
                      <input
                        id="field-acepta"
                        name="acepta"
                        type="checkbox"
                        checked={form.acepta}
                        onChange={(e) => update("acepta", e.target.checked)}
                        aria-invalid={Boolean(errors.acepta)}
                        aria-describedby={errors.acepta ? "error-acepta" : undefined}
                        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-line accent-accent"
                      />
                      Acepto ser contactado por CCIP para atender esta solicitud y el tratamiento de mis datos
                      según la política de privacidad.
                    </label>
                    {errors.acepta && (
                      <p id="error-acepta" className="mt-1.5 text-[0.68rem] text-rose-500">
                        {errors.acepta}
                      </p>
                    )}
                  </div>
                  </div>

                  <button
                    type={isExpanded ? "submit" : "button"}
                    onClick={(event) => {
                      if (!isExpanded) {
                        event.preventDefault();
                        setIsExpanded(true);
                      }
                    }}
                    disabled={loading}
                    aria-expanded={isExpanded}
                    aria-controls="additional-request-fields"
                    className="btn btn-primary mt-5 h-12 w-full disabled:opacity-80"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Enviando solicitud...
                      </>
                    ) : isExpanded ? (
                      "Enviar solicitud de cotización"
                    ) : (
                      "Completar solicitud"
                    )}
                  </button>
                  <p className="mt-3 text-center text-[0.64rem] text-muted/70">
                    Respuesta de un ingeniero en menos de 24 horas hábiles. Sin compromiso.
                  </p>
                </form>
              </div>
            )}
          </Reveal>
        </div>

        {!isExpanded && <div className="mt-4">{projectCard}</div>}

        <Reveal delay={80}>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:gap-6">
            <p className="text-[0.72rem] text-muted">¿Prefiere una conversación directa con el equipo técnico?</p>
            <a href={CONTACT.whatsapp} target="_blank" rel="noreferrer" className="link-arrow">
              Agendar una llamada
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}