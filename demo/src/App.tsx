import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { MessageCircle } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { Services } from "@/components/Services";
import { Approach } from "@/components/Approach";
import { About } from "@/components/About";
import { Blog } from "@/components/Blog";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { CONTACT, type Theme } from "@/lib/data";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("theme");
    if (requested === "light" || requested === "dark") return requested;
    const stored = window.localStorage.getItem("ccip-theme");
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* storage may be unavailable */
  }
  return "dark";
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [quoteService, setQuoteService] = useState<string | undefined>(undefined);
  const [ripple, setRipple] = useState<{ x: number; y: number; id: number } | null>(null);
  const rippleTimer = useRef<number | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
    try {
      window.localStorage.setItem("ccip-theme", theme);
    } catch {
      /* ignore */
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#061429" : "#edf2f7");
  }, [theme]);

  const toggleTheme = useCallback(() => {
    const button = document.querySelector<HTMLElement>("[data-theme-toggle]");
    if (button) {
      const rect = button.getBoundingClientRect();
      setRipple({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, id: Date.now() });
      if (rippleTimer.current) window.clearTimeout(rippleTimer.current);
      rippleTimer.current = window.setTimeout(() => setRipple(null), 900);
    }
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  const scrollToSection = useCallback((id: string, updateHash = true) => {
    const target = document.getElementById(id);
    if (!target) return;

    const href = `#${id}`;
    if (updateHash && window.location.hash !== href) window.history.pushState(null, "", href);
    window.requestAnimationFrame(() => {
      const headerHeight = document.querySelector<HTMLElement>("header")?.getBoundingClientRect().height ?? 0;
      const top = window.scrollY + target.getBoundingClientRect().top - headerHeight;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    });
  }, []);

  const handleSectionNavigation = useCallback((event: MouseEvent<HTMLDivElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      !(event.target instanceof Element)
    ) {
      return;
    }

    const link = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
    const href = link?.getAttribute("href");
    const target = href && href.length > 1 ? document.getElementById(href.slice(1)) : null;
    if (!link || !href || !target || link.target === "_blank" || link.hasAttribute("download")) return;

    event.preventDefault();
    scrollToSection(href.slice(1));
  }, [scrollToSection]);

  const handleQuote = useCallback((service?: string) => {
    setQuoteService(service ?? "Otra solución / asesoría a medida");
    window.setTimeout(() => {
      scrollToSection("contacto", false);
    }, 40);
  }, [scrollToSection]);

  return (
    <div className="relative min-h-screen bg-bg text-ink" onClick={handleSectionNavigation}>
      {ripple && (
        <span
          key={ripple.id}
          aria-hidden="true"
          className="pointer-events-none fixed z-[90] h-6 w-6 rounded-full bg-accent/25 blur-[2px]"
          style={{
            left: ripple.x,
            top: ripple.y,
            animation: "theme-ripple 0.9s cubic-bezier(0.16,1,0.3,1) forwards",
          }}
        />
      )}
      <a
        href="#servicios"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink focus:shadow-lg"
      >
        Saltar al contenido
      </a>

      <Navbar theme={theme} onToggleTheme={toggleTheme} onQuote={() => handleQuote()} />

      <main>
        <Hero theme={theme} onQuote={() => handleQuote()} />
        <TrustBar />
        <Services onQuote={handleQuote} />
        <Approach onQuote={handleQuote} />
        <About />
        <Blog onQuote={handleQuote} />
        <Contact preselect={quoteService} />
      </main>

      <Footer onQuote={() => handleQuote()} />

      <a
        href={CONTACT.whatsapp}
        target="_blank"
        rel="noreferrer"
        aria-label="Escribir a CCIP por WhatsApp"
        className="group fixed bottom-5 right-5 z-30 flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full border border-emerald-400/30 bg-[#1faa53] px-3.5 text-white shadow-[0_16px_36px_-12px_rgba(31,170,83,0.65)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-[#199547] hover:shadow-[0_20px_44px_-10px_rgba(31,170,83,0.78)] sm:px-4"
      >
        <MessageCircle className="h-[19px] w-[19px] shrink-0" strokeWidth={2} />
        <span className="max-w-0 whitespace-nowrap text-[0.76rem] font-semibold opacity-0 transition-all duration-300 lg:group-hover:max-w-[130px] lg:group-hover:opacity-100">
          Hablemos por WhatsApp
        </span>
      </a>
    </div>
  );
}
