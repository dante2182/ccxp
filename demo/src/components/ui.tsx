import type { ReactNode } from "react";
import {
  BatteryCharging,
  Camera,
  Cable,
  Database,
  LockKeyhole,
  Moon,
  Network,
  RadioTower,
  Server,
  ShieldCheck,
  Sun,
  Flame,
  Leaf,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/utils/cn";
import type { Theme } from "@/lib/data";

const serviceIcons: Record<string, LucideIcon> = {
  telecom: RadioTower,
  network: Network,
  security: ShieldCheck,
  energy: BatteryCharging,
};

export function ServiceIcon({
  name,
  className,
  strokeWidth = 1.6,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Icon = serviceIcons[name] ?? RadioTower;
  return <Icon className={className} strokeWidth={strokeWidth} />;
}

export const categoryIcons: Record<string, LucideIcon> = {
  telecom: RadioTower,
  security: ShieldCheck,
  energy: BatteryCharging,
};

export const featureIcons = {
  cable: Cable,
  server: Server,
  database: Database,
  lock: LockKeyhole,
  camera: Camera,
  flame: Flame,
  leaf: Leaf,
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      <div className="eyebrow">
        <span className="h-1.5 w-1.5 rounded-full bg-teal shadow-[0_0_10px_2px_color-mix(in_oklab,var(--accent)_35%,transparent)]" />
        {eyebrow}
      </div>
      <h2 className="mt-5 max-w-[19ch] text-[2.1rem] font-[700] leading-[1.04] tracking-[-0.045em] text-ink sm:text-[2.8rem] lg:text-[3.35rem]">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-5 max-w-[58ch] text-[0.95rem] leading-relaxed text-muted sm:text-base",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}

export function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      data-theme-toggle
      onClick={onToggle}
      aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
      title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      className="group relative inline-flex h-10 w-[4.3rem] shrink-0 items-center rounded-full border border-line-strong bg-surface-2/70 p-1 transition-colors hover:border-accent/50"
    >
      <span
        className={cn(
          "relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-surface shadow-[0_3px_10px_rgba(2,12,27,0.22)] ring-1 ring-line transition-transform duration-[450ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]",
          isDark ? "translate-x-0" : "translate-x-[1.8rem]"
        )}
      >
        {isDark ? (
          <Moon className="h-4 w-4 text-accent" strokeWidth={1.9} />
        ) : (
          <Sun className="h-4 w-4 text-accent" strokeWidth={1.9} />
        )}
      </span>
      <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-muted/60 transition-all duration-300 group-hover:text-muted">
        {isDark ? <Sun className="h-3.5 w-3.5" strokeWidth={2} /> : <Moon className="h-3.5 w-3.5" strokeWidth={2} />}
      </span>
      <span className="sr-only">Cambiar tema</span>
    </button>
  );
}

export function StatusDot({ className }: { className?: string }) {
  return (
    <span className={cn("relative flex h-2 w-2", className)}>
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-40" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
    </span>
  );
}
