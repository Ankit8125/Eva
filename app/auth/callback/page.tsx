"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { LoaderCircle, Sparkles } from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    void refresh()
      .then((user) => {
        if (!active) return;
        if (user) router.replace("/");
        else setError("We could not complete that sign-in. Please try again.");
      })
      .catch(() => active && setError("We could not complete that sign-in. Please try again."));
    return () => { active = false; };
  }, [refresh, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-card p-8 text-center shadow-xl shadow-foreground/[0.05]">
        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground"><Sparkles className="size-5" /></span>
        {error ? <><h1 className="mt-5 text-xl font-semibold">Sign-in interrupted</h1><p className="mt-2 text-sm text-muted-foreground">{error}</p><button className="mt-6 text-sm font-semibold text-primary hover:underline" onClick={() => router.replace("/sign-in")}>Return to sign in</button></> : <><LoaderCircle className="mx-auto mt-5 size-5 animate-spin text-primary" /><h1 className="mt-3 text-xl font-semibold">Opening your studio</h1><p className="mt-2 text-sm text-muted-foreground">Securing your session and getting things ready.</p></>}
      </div>
    </main>
  );
}
