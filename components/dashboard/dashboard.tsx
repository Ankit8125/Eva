"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Bot,
  ChevronDown,
  CircleDollarSign,
  Clapperboard,
  CreditCard,
  Home,
  LibraryBig,
  Menu,
  Mic2,
  Settings2,
  Sparkles,
  UserRound,
  UsersRound,
  Video,
  WandSparkles,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";

import type { AuthUser } from "@/components/providers/auth-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

type NavItem = {
  label: string;
  icon: LucideIcon;
  active?: boolean;
};

type Feature = {
  name: string;
  description: string;
  icon: LucideIcon;
  media: { src: string; type: "video" | "image" };
};

const navItems: NavItem[] = [
  { label: "Home", icon: Home, active: true },
  { label: "AI Video Agent", icon: Bot },
  { label: "AI Video Avatar", icon: Video },
  { label: "Avatar", icon: UsersRound },
  { label: "AI Voice Cloning", icon: Mic2 },
  { label: "My Library", icon: LibraryBig },
];

const features: Feature[] = [
  {
    name: "AI Video Agent",
    description: "Turn a spark of an idea into a fully produced video.",
    icon: Clapperboard,
    media: { src: "/ai-video-agent.mp4", type: "video" },
  },
  {
    name: "AI Video Avatar",
    description: "Create expressive avatar videos in minutes, not days.",
    icon: Video,
    media: { src: "/ai-avatar.mp4", type: "video" },
  },
  {
    name: "Avatar",
    description: "Design a lifelike digital presenter for every story.",
    icon: UserRound,
    media: { src: "/avatar.mp4", type: "video" },
  },
  {
    name: "AI Voice Cloning",
    description: "Build a voice that sounds unmistakably yours.",
    icon: Mic2,
    media: { src: "/voice-cloning.png", type: "image" },
  },
];

function userName(user: AuthUser) {
  const profile = user.profile as { name?: string } | null;
  return profile?.name || user.email?.split("@")[0] || "Creator";
}

function FeatureCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon;

  return (
    <article className="group relative isolate min-h-72 overflow-hidden rounded-[1.65rem] border border-white/10 bg-slate-950 shadow-[0_22px_48px_-28px_rgba(15,23,42,.65)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_55px_-28px_rgba(8,47,73,.8)] focus-within:-translate-y-1 sm:min-h-[22rem]">
      {feature.media.type === "video" ? (
        <video
          aria-hidden="true"
          autoPlay
          className="absolute inset-0 -z-10 size-full object-cover transition duration-700 group-hover:scale-105"
          loop
          muted
          playsInline
          preload="metadata"
        >
          <source src={feature.media.src} type="video/mp4" />
        </video>
      ) : (
        // This is a decorative media background; the text content below names the feature.
        // eslint-disable-next-line @next/next/no-img-element
        <img alt="" aria-hidden="true" className="absolute inset-0 -z-10 size-full object-cover transition duration-700 group-hover:scale-105" src={feature.media.src} />
      )}
      <div aria-hidden="true" className="absolute inset-0 -z-0 bg-[linear-gradient(180deg,rgba(2,6,23,.1)_10%,rgba(2,6,23,.28)_42%,rgba(2,6,23,.94)_100%)]" />
      <div className="relative z-10 flex min-h-72 flex-col items-start justify-between p-5 sm:min-h-[22rem] sm:p-6">
        <span className="flex size-10 items-center justify-center rounded-xl border border-white/20 bg-white/15 text-white shadow-sm backdrop-blur-md">
          <Icon aria-hidden="true" className="size-[1.1rem]" />
        </span>
        <div>
          <h2 className="text-xl font-semibold tracking-[-0.035em] text-white sm:text-2xl">{feature.name}</h2>
          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-200">{feature.description}</p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white transition-transform duration-200 group-hover:translate-x-1">
            Explore feature <span aria-hidden="true">&#8594;</span>
          </span>
        </div>
      </div>
    </article>
  );
}

export function Dashboard({ user }: { user: AuthUser }) {
  const router = useRouter();
  const { signOut } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const [isSigningOut, setIsSigningOut] = React.useState(false);
  const name = userName(user);
  const firstName = name.split(" ")[0];
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      await signOut();
      router.replace("/sign-in");
      router.refresh();
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-[280px] flex-col border-r border-sidebar-border bg-sidebar px-4 py-5 shadow-2xl shadow-slate-950/10 transition-transform duration-300 lg:translate-x-0 lg:shadow-none ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3 text-lg font-semibold tracking-[-0.035em]">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Sparkles aria-hidden="true" className="size-[1.05rem]" />
            </span>
            EVA Studio
          </div>
          <Button aria-label="Close navigation" className="lg:hidden" onClick={() => setMobileNavOpen(false)} size="icon-sm" type="button" variant="ghost">
            <X />
          </Button>
        </div>

        <nav aria-label="Primary navigation" className="mt-10 space-y-1">
          {navItems.map(({ label, icon: Icon, active }) => (
            <button
              aria-current={active ? "page" : undefined}
              className={`flex h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium transition-colors ${active ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md shadow-primary/15" : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}
              key={label}
              type="button"
            >
              <Icon aria-hidden="true" className="size-4" />
              {label}
            </button>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl border border-sidebar-border bg-background/55 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><CreditCard aria-hidden="true" className="size-4" /></span>
            Billing settings
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-sidebar-border pt-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Available credits</p>
              <p className="mt-1 text-lg font-semibold tracking-[-0.035em]">6,720</p>
            </div>
            <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/12 text-emerald-600 dark:text-emerald-400"><Zap aria-hidden="true" className="size-4" /></span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Renews on September 1</p>
        </div>
      </aside>

      {mobileNavOpen && <button aria-label="Close navigation overlay" className="fixed inset-0 z-30 bg-slate-950/45 backdrop-blur-sm lg:hidden" onClick={() => setMobileNavOpen(false)} type="button" />}

      <main className="min-h-screen lg:pl-[280px]">
        <header className="sticky top-0 z-20 flex h-[74px] items-center justify-between border-b border-border/70 bg-background/85 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <Button aria-label="Open navigation" className="lg:hidden" onClick={() => setMobileNavOpen(true)} size="icon" type="button" variant="outline">
              <Menu />
            </Button>
            <span className="hidden text-sm font-medium text-muted-foreground sm:block">Creative workspace</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button className="flex items-center gap-2 rounded-xl p-1.5 transition-colors hover:bg-muted disabled:cursor-wait" disabled={isSigningOut} onClick={handleSignOut} type="button">
              <span className="flex size-8 items-center justify-center rounded-lg bg-secondary text-xs font-bold text-secondary-foreground">{initials}</span>
              <span className="hidden text-left sm:block">
                <span className="block max-w-32 truncate text-xs font-semibold">{name}</span>
                <span className="block max-w-32 truncate text-[11px] text-muted-foreground">{isSigningOut ? "Signing out…" : "Personal workspace"}</span>
              </span>
              <ChevronDown aria-hidden="true" className="hidden size-3.5 text-muted-foreground sm:block" />
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-medium text-primary"><WandSparkles aria-hidden="true" className="size-4" />Your AI studio</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.055em] sm:text-4xl">What will you create, {firstName}?</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">Bring your stories to life with intelligent video, avatars, and voices designed around your vision.</p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-muted-foreground shadow-sm">
              <CircleDollarSign aria-hidden="true" className="size-4 text-primary" />
              <span><strong className="font-semibold text-foreground">6,720</strong> credits ready</span>
            </div>
          </section>

          <section aria-labelledby="features-heading" className="mt-9">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 id="features-heading" className="text-lg font-semibold tracking-[-0.03em]">Create something remarkable</h2>
                <p className="mt-1 text-sm text-muted-foreground">Choose a tool to start your next project.</p>
              </div>
              <span className="hidden rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary sm:inline-flex">4 creative tools</span>
            </div>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {features.map((feature) => <FeatureCard feature={feature} key={feature.name} />)}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
