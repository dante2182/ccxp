import { useEffect, useState } from "react";
import { ArrowRight, Menu, X, MessageCircle } from "lucide-react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ui";
import { CONTACT, type Theme } from "@/lib/data";
import { cn } from "@/utils/cn";

const LINKS = [
  { label: "Inicio", href: "#inicio", id: "inicio" },
  { label: "Servicios", href: "#servicios", id: "servicios" },
  { label: "Capacidades", href: "#capacidades", id: "capacidades" },
  { label: "Nosotros", href: "#nosotros", id: "nosotros" },
  { label: "Blog", href: "#blog", id: "blog" },
  { label: "Contáctenos", href: "#contacto", id: "contacto" },
];

export function Navbar({
  theme,
  onToggleTheme,
  onQuote,
}: {
  theme: Theme;
  onToggleTheme: () => void;
  onQuote: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState("inicio");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      setScrolled(y > 24);
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? Math.min(1, y / height) : 0);

      let current = "inicio";
      LINKS.forEach((link) => {
        const node = document.getElementById(link.id);
        if (node && node.getBoundingClientRect().top <= window.innerHeight * 0.32) current = link.id;
      });
      setActive(current);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 bg-bg",
          scrolled ? "border-b border-line shadow-[0_10px_40px_-24px_rgba(2,12,27,0.5)]" : "border-b border-transparent"
        )}
      >
        {scrolled && (
          <div className="pointer-events-none absolute inset-0 -z-10 backdrop-blur-2xl backdrop-saturate-150" />
        )}
        <div className="container-x flex h-[4.4rem] items-center justify-between gap-4 lg:h-[4.75rem]">
          <a href="#inicio" aria-label="CCIP inicio" className="shrink-0">
            <Logo />
          </a>

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Navegación principal">
            {LINKS.map((link) => (
              <a
                key={link.id}
                href={link.href}
                className={cn(
                  "group/nav relative rounded-full px-3.5 py-2 text-[0.8rem] font-medium tracking-[-0.01em] transition-colors duration-200",
                  active === link.id ? "text-ink" : "text-muted hover:text-ink"
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute inset-x-3.5 -bottom-[1px] h-[2px] origin-center scale-x-0 rounded-full bg-gradient-to-r from-accent to-teal transition-all duration-300 group-hover/nav:scale-x-100",
                    active === link.id ? "scale-x-100 opacity-100" : "opacity-0 group-hover/nav:opacity-100"
                  )}
                />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <a href="#contacto" className="btn btn-primary hidden sm:inline-flex">
              Contáctenos
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </a>
            <button
              type="button"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line-strong bg-surface/50 text-ink lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-[1.5px] overflow-hidden">
          <div
            className="h-full origin-left bg-gradient-to-r from-accent via-teal to-accent-strong transition-transform duration-150"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
      </header>

      {/* Mobile sheet */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none"
        )}
        aria-hidden={!open}
      >
        <div
          className={cn(
            "absolute inset-0 bg-[#02060e]/55 backdrop-blur-sm transition-opacity duration-300",
            open ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setOpen(false)}
        />
        <div
          className={cn(
            "absolute inset-x-3 top-[4.9rem] overflow-hidden rounded-2xl border border-line bg-surface/95 p-3 shadow-2xl backdrop-blur-2xl transition-all duration-400 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)]",
            open ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          )}
        >
          <nav className="flex flex-col" aria-label="Navegación móvil">
            {LINKS.map((link, i) => (
              <a
                key={link.id}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center justify-between rounded-xl px-4 py-3.5 text-[0.95rem] font-medium transition-colors",
                  active === link.id ? "bg-surface-2 text-ink" : "text-muted hover:bg-surface-2 hover:text-ink"
                )}
                style={{ transitionDelay: `${i * 20}ms` }}
              >
                {link.label}
                <ArrowRight className="h-4 w-4 opacity-40" />
              </a>
            ))}
          </nav>
          <div className="mt-2 grid gap-2 border-t border-line p-1 pt-3">
            <a href="#contacto" onClick={() => setOpen(false)} className="btn btn-primary w-full">
              Contáctenos
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="btn btn-ghost w-full"
            >
              <MessageCircle className="h-4 w-4 text-emerald-500" />
              Escribir por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
