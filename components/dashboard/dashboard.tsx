"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Bot,
  ChevronDown,
  CircleHelp,
  Clock3,
  FolderKanban,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Settings2,
  Sparkles,
  WandSparkles,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from "recharts";

import type { AuthUser } from "@/components/providers/auth-provider";
import { useAuth } from "@/components/providers/auth-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const usageData = [
  { day: "Mon", credits: 32 }, { day: "Tue", credits: 48 }, { day: "Wed", credits: 37 },
  { day: "Thu", credits: 68 }, { day: "Fri", credits: 54 }, { day: "Sat", credits: 78 }, { day: "Sun", credits: 64 },
];

const projects = [
  { name: "Orbital identity", type: "Brand system", updated: "12 min ago", members: ["AM", "LC", "JR"], color: "bg-cyan-500" },
  { name: "Atlas campaign", type: "Creative direction", updated: "48 min ago", members: ["MK", "CL"], color: "bg-amber-400" },
  { name: "Hearth launch", type: "Product narrative", updated: "2 hr ago", members: ["NS", "YD", "AP", "VK"], color: "bg-emerald-500" },
];

const activity = [
  { title: "Concept directions generated", detail: "Orbital identity · 6 variations", time: "8 min", icon: Sparkles, tone: "bg-cyan-500/12 text-cyan-700 dark:text-cyan-300" },
  { title: "Moodboard shared with the team", detail: "Atlas campaign · 14 new references", time: "42 min", icon: FolderKanban, tone: "bg-amber-400/15 text-amber-700 dark:text-amber-300" },
  { title: "Prompt library updated", detail: "3 reusable starting points", time: "2 hr", icon: WandSparkles, tone: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300" },
];

const navItems = [
  { label: "Overview", icon: LayoutDashboard, active: true }, { label: "Projects", icon: FolderKanban },
  { label: "Generations", icon: Sparkles }, { label: "Usage", icon: Activity },
];

function userName(user: AuthUser) {
  const profile = user.profile as { name?: string } | null;
  return profile?.name || user.email?.split("@")[0] || "Creator";
}

function MetricCard({ label, value, trend, icon: Icon }: { label: string; value: string; trend: string; icon: LucideIcon }) {
  return <div className="rounded-2xl border border-border/75 bg-card p-5 shadow-[0_14px_36px_-27px_rgba(15,23,42,.28)]"><div className="flex items-start justify-between"><p className="text-sm text-muted-foreground">{label}</p><span className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="size-4" /></span></div><div className="mt-5 flex items-end justify-between"><p className="text-2xl font-semibold tracking-[-0.04em]">{value}</p><span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400"><ArrowUpRight className="size-3.5" />{trend}</span></div></div>;
}

export function Dashboard({ user }: { user: AuthUser }) {
  const router = useRouter();
  const { signOut } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const [isSigningOut, setIsSigningOut] = React.useState(false);
  const name = userName(user);
  const initials = name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();

  async function handleSignOut() {
    setIsSigningOut(true);
    await signOut();
    router.replace("/sign-in");
    router.refresh();
  }

  return <div className="min-h-screen bg-background text-foreground">
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-[272px] flex-col border-r border-border/70 bg-card px-4 py-5 transition-transform duration-300 lg:translate-x-0 ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="flex items-center justify-between px-2"><div className="flex items-center gap-3 text-lg font-semibold tracking-tight"><span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"><Sparkles className="size-4" /></span>EVA Studio</div><Button className="lg:hidden" onClick={() => setMobileNavOpen(false)} size="icon-sm" variant="ghost"><X /></Button></div>
      <div className="mt-10 space-y-1">{navItems.map(({ label, icon: Icon, active }) => <button className={`flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors ${active ? "bg-primary text-primary-foreground shadow-md shadow-primary/15" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`} key={label} type="button"><Icon className="size-4" />{label}</button>)}</div>
      <div className="mt-7 px-3"><p className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">Workspace</p></div>
      <div className="mt-3 space-y-1"><button className="flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground" type="button"><Bot className="size-4" />Model library</button><button className="flex h-10 w-full items-center gap-3 rounded-xl px-3 text-sm text-muted-foreground hover:bg-muted hover:text-foreground" type="button"><Settings2 className="size-4" />Settings</button></div>
      <div className="mt-auto rounded-2xl bg-primary/[0.055] p-4"><span className="flex size-8 items-center justify-center rounded-xl bg-primary/12 text-primary"><Zap className="size-4" /></span><p className="mt-3 text-sm font-semibold">Scale the studio</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Unlock more generations and collaborative spaces.</p><Button className="mt-4 h-8 w-full rounded-lg text-xs" size="sm">View plans</Button></div>
    </aside>
    {mobileNavOpen && <button aria-label="Close navigation" className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-sm lg:hidden" onClick={() => setMobileNavOpen(false)} type="button" />}
    <main className="lg:pl-[272px]">
      <header className="sticky top-0 z-20 flex h-[73px] items-center justify-between border-b border-border/70 bg-background/85 px-5 backdrop-blur-xl sm:px-8 lg:px-10"><div className="flex items-center gap-3"><Button className="lg:hidden" onClick={() => setMobileNavOpen(true)} size="icon" variant="outline"><Menu /></Button><div className="hidden w-[min(33vw,380px)] items-center gap-2 rounded-xl border border-border/80 bg-card px-3 py-2 text-sm text-muted-foreground shadow-sm sm:flex"><Search className="size-4" /><span className="flex-1">Search your studio</span><kbd className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px]">⌘ K</kbd></div></div><div className="flex items-center gap-2"><Button className="hidden rounded-xl sm:inline-flex" size="sm"><Plus className="size-4" />New project</Button><Button aria-label="Notifications" className="rounded-xl" size="icon" variant="outline"><Bell className="size-4" /></Button><ThemeToggle /><button className="ml-1 flex items-center gap-2 rounded-xl p-1.5 hover:bg-muted" disabled={isSigningOut} onClick={handleSignOut} type="button"><span className="flex size-8 items-center justify-center rounded-lg bg-secondary text-xs font-bold text-secondary-foreground">{initials}</span><span className="hidden text-left sm:block"><span className="block max-w-28 truncate text-xs font-semibold">{name}</span><span className="block max-w-28 truncate text-[11px] text-muted-foreground">{isSigningOut ? "Signing out…" : "Personal space"}</span></span><ChevronDown className="hidden size-3.5 text-muted-foreground sm:block" /></button></div></header>
      <div className="mx-auto max-w-[1580px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-sm font-medium text-primary">Friday, August 8</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">Good morning, {name.split(" ")[0]}.</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">A clear canvas and 3 active projects are waiting for you.</p></div><Button className="h-11 rounded-xl shadow-lg shadow-primary/20"><WandSparkles className="size-4" />Create with AI</Button></section>
        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><MetricCard icon={Sparkles} label="Generations this month" trend="18.4%" value="1,284" /><MetricCard icon={FolderKanban} label="Active projects" trend="2 new" value="12" /><MetricCard icon={Clock3} label="Time saved" trend="6.2%" value="42.8h" /><MetricCard icon={Zap} label="Credits remaining" trend="67% left" value="6,720" /></section>
        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(340px,0.85fr)]"><div className="rounded-3xl border border-border/75 bg-card p-5 shadow-[0_18px_42px_-32px_rgba(15,23,42,.38)] sm:p-6"><div className="flex items-start justify-between"><div><p className="text-sm font-semibold">AI usage</p><p className="mt-1 text-sm text-muted-foreground">Credits used in the last 7 days</p></div><Badge className="bg-primary/10 text-primary" variant="secondary">+21.8%</Badge></div><div className="mt-7 h-56"><ResponsiveContainer height="100%" width="100%"><AreaChart data={usageData} margin={{ top: 8, left: -25, right: 4, bottom: 0 }}><defs><linearGradient id="usage-gradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="var(--primary)" stopOpacity={0.26} /><stop offset="100%" stopColor="var(--primary)" stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke="var(--border)" strokeDasharray="3 5" vertical={false} /><XAxis axisLine={false} dataKey="day" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} tickLine={false} /><Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: "12px" }} cursor={{ stroke: "var(--primary)", strokeWidth: 1 }} /><Area dataKey="credits" fill="url(#usage-gradient)" stroke="var(--primary)" strokeWidth={2.5} type="monotone" /></AreaChart></ResponsiveContainer></div></div><div className="rounded-3xl border border-border/75 bg-card p-5 shadow-[0_18px_42px_-32px_rgba(15,23,42,.38)] sm:p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-semibold">Quick create</p><p className="mt-1 text-sm text-muted-foreground">Turn a thought into a direction.</p></div><span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><WandSparkles className="size-4" /></span></div><div className="mt-6 rounded-2xl border border-border bg-background p-4"><p className="text-sm leading-6 text-muted-foreground">What are you imagining today?</p><div className="mt-8 flex items-center justify-between"><div className="flex gap-1.5"><span className="size-2 rounded-full bg-cyan-500" /><span className="size-2 rounded-full bg-amber-400" /><span className="size-2 rounded-full bg-emerald-500" /></div><Button className="rounded-xl" size="sm">Generate <ArrowUpRight className="size-3.5" /></Button></div></div><div className="mt-4 flex flex-wrap gap-2">{["Brand story", "Campaign ideas", "Moodboard"].map((label) => <button className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/30 hover:text-primary" key={label} type="button">{label}</button>)}</div></div></section>
        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(340px,0.7fr)]"><div className="rounded-3xl border border-border/75 bg-card p-5 shadow-[0_18px_42px_-32px_rgba(15,23,42,.38)] sm:p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-semibold">Your projects</p><p className="mt-1 text-sm text-muted-foreground">Keep your best work in motion.</p></div><Button className="rounded-xl" size="sm" variant="outline">View all <ArrowUpRight className="size-3.5" /></Button></div><div className="mt-5 divide-y divide-border/70">{projects.map((project) => <div className="flex items-center gap-3 py-4 first:pt-1" key={project.name}><span className={`flex size-10 items-center justify-center rounded-xl ${project.color} text-white shadow-sm`}><FolderKanban className="size-4" /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{project.name}</p><p className="mt-0.5 text-xs text-muted-foreground">{project.type} · {project.updated}</p></div><div className="hidden -space-x-2 sm:flex">{project.members.map((member) => <span className="flex size-6 items-center justify-center rounded-full border-2 border-card bg-secondary text-[9px] font-bold text-secondary-foreground" key={member}>{member}</span>)}</div><Button aria-label={`More actions for ${project.name}`} size="icon-sm" variant="ghost"><MoreHorizontal className="size-4" /></Button></div>)}</div></div><div className="rounded-3xl border border-border/75 bg-card p-5 shadow-[0_18px_42px_-32px_rgba(15,23,42,.38)] sm:p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-semibold">Recent activity</p><p className="mt-1 text-sm text-muted-foreground">What moved forward today.</p></div><Button aria-label="Activity help" size="icon-sm" variant="ghost"><CircleHelp className="size-4" /></Button></div><div className="mt-5 space-y-5">{activity.map(({ title, detail, time, icon: Icon, tone }) => <div className="flex gap-3" key={title}><span className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${tone}`}><Icon className="size-4" /></span><div className="min-w-0 flex-1"><div className="flex justify-between gap-3"><p className="text-sm font-medium">{title}</p><span className="shrink-0 text-[11px] text-muted-foreground">{time}</span></div><p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p></div></div>)}</div><button className="mt-6 flex items-center gap-2 text-xs font-semibold text-primary hover:underline" type="button">View all activity <ArrowRight className="size-3.5" /></button></div></section>
      </div>
    </main>
  </div>;
}
