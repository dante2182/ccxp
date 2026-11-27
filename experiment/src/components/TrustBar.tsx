import { Building2, Factory, Landmark, GraduationCap, HeartPulse, Store } from "lucide-react";
import { Reveal } from "./Reveal";
import { STATS, TRUST_CLIENTS } from "@/lib/data";

const sectorIcons = [Building2, Factory, Landmark, HeartPulse, GraduationCap, Store];

export function TrustBar() {
  return (
    <section aria-label="Experiencia y sectores" className="relative border-y border-line bg-surface/35">
      <div className="group relative flex items-center gap-4 overflow-hidden border-b border-line py-4">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-bg to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-bg to-transparent" />
        <div className="flex w-max animate-marquee items-center">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              <span className="mr-8 hidden whitespace-nowrap pl-8 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-muted/70 sm:block">
                Experiencia comprobada en
              </span>
              {TRUST_CLIENTS.map((client, i) => {
                const Icon = sectorIcons[i % sectorIcons.length];
                return (
                  <div key={`${copy}-${client}`} className="flex items-center gap-2.5 px-6">
                    <Icon className="h-3.5 w-3.5 text-accent/70" strokeWidth={1.7} />
                    <span className="whitespace-nowrap text-[0.78rem] font-medium text-muted">{client}</span>
                    <span className="ml-4 h-1 w-1 rounded-full bg-line-strong" />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="container-x grid grid-cols-2 gap-y-8 py-9 sm:grid-cols-4 sm:divide-x sm:divide-line">
        {STATS.map((stat, i) => (
          <Reveal
            key={stat.label}
            delay={i * 80}
            className="px-1 sm:px-6 sm:first:pl-0 sm:last:pr-0"
          >
            <div className="flex items-baseline gap-2">
              <span className="tabular text-[1.9rem] font-[700] leading-none tracking-[-0.05em] text-ink sm:text-[2.2rem]">
                {stat.value}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-teal/70" />
            </div>
            <p className="mt-2 text-[0.75rem] font-medium text-muted">{stat.label}</p>
            <p className="mt-0.5 text-[0.64rem] uppercase tracking-[0.1em] text-muted/60">{stat.detail}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
