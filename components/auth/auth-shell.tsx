import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className="relative grid min-h-screen overflow-hidden bg-background lg:grid-cols-[1.08fr_0.92fr]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_5%_12%,color-mix(in_oklch,var(--accent),transparent_76%),transparent_30%),radial-gradient(circle_at_92%_88%,color-mix(in_oklch,var(--primary),transparent_92%),transparent_30%)]" />
      <section className="relative flex min-h-screen flex-col px-5 py-5 sm:px-8 lg:px-12 lg:py-10 xl:px-18">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-lg font-semibold tracking-tight">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Sparkles className="size-5" />
            </span>
            EVA Studio
          </div>
          <ThemeToggle />
        </div>
        <div className="relative z-10 mx-auto flex w-full max-w-md flex-1 items-center py-12">
          {children}
        </div>
      </section>

      <aside className="relative hidden overflow-hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(112,222,220,0.34),transparent_28%),radial-gradient(circle_at_80%_74%,rgba(255,224,154,0.16),transparent_28%)]" />
        <div className="relative flex h-full flex-col justify-between">
          <div className="max-w-md">
            <p className="mb-5 text-sm font-medium tracking-[0.18em] text-primary-foreground/65 uppercase">
              Your creative operating system
            </p>
            <h1 className="text-balance text-5xl leading-[1.04] font-semibold tracking-[-0.055em]">
              Build the next idea before it leaves your mind.
            </h1>
            <p className="mt-6 max-w-sm text-base leading-7 text-primary-foreground/70">
              One focused workspace for creative AI, production workflows, and the momentum your team needs.
            </p>
          </div>
          <div className="rounded-3xl border border-primary-foreground/15 bg-primary-foreground/8 p-6 backdrop-blur-sm">
            <div className="mb-6 flex -space-x-2">
              {['AR', 'KM', 'JT', 'LS'].map((initials, index) => (
                <span
                  className="flex size-9 items-center justify-center rounded-full border-2 border-primary bg-primary-foreground/15 text-xs font-semibold"
                  key={initials}
                  style={{ transform: `translateX(${index * -2}px)` }}
                >
                  {initials}
                </span>
              ))}
            </div>
            <p className="text-sm leading-6 text-primary-foreground/80">
              “EVA has made our creative process feel intentional again.”
            </p>
            <p className="mt-3 text-xs font-medium tracking-wide text-primary-foreground/55 uppercase">
              Mina Chen · Aster Collective
            </p>
          </div>
        </div>
      </aside>
    </main>
  );
}
