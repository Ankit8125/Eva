"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { LoaderCircle, Sparkles } from "lucide-react";

import { Dashboard } from "@/components/dashboard/dashboard";
import { useAuth } from "@/components/providers/auth-provider";

export function DashboardGate() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  React.useEffect(() => {
    if (!isLoading && !user) router.replace("/sign-in");
  }, [isLoading, router, user]);

  if (isLoading) return <main className="flex min-h-screen items-center justify-center bg-background"><div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 text-sm text-muted-foreground shadow-lg shadow-foreground/[0.04]"><span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Sparkles className="size-4" /></span><LoaderCircle className="size-4 animate-spin text-primary" />Loading your studio</div></main>;
  if (!user) return null;
  return <Dashboard user={user} />;
}
