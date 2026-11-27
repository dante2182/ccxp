import { cn } from "@/utils/cn";

export function Logo({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  return (
    <div className={cn("flex items-center gap-3", className)} aria-label="CCIP Telecomunicaciones e Ingeniería">
      <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[13px] bg-white p-1 shadow-[0_8px_22px_-8px_color-mix(in_oklab,var(--accent)_35%,transparent)]">
        <img src="/logo_ccip.png" alt="CCIP Logo" className="h-full w-full object-contain" />
        <span
          aria-hidden="true"
          className="absolute left-[7px] top-[7px] h-1 w-1 rounded-full bg-brand-lime shadow-[0_0_6px_1px_color-mix(in_oklab,var(--brand-lime)_55%,transparent)]"
        />
      </div>
      <div className="leading-none">
        <div
          className={cn(
            "text-[1.32rem] font-[750] tracking-[-0.045em]",
            onDark ? "text-white" : "text-ink"
          )}
        >
          CCIP
        </div>
        <div className="mt-1 text-[0.48rem] font-semibold uppercase tracking-[0.19em] text-muted sm:text-[0.52rem]">
          Telecomunicaciones &amp; Ingeniería
        </div>
      </div>
    </div>
  );
}
