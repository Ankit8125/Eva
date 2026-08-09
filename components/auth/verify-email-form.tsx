"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { ArrowRight, LoaderCircle, MailCheck } from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { insforge } from "@/lib/insforge";

export function VerifyEmailForm() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [email, setEmail] = React.useState("");
  const [code, setCode] = React.useState("");
  const [message, setMessage] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);

  React.useEffect(() => {
    const timeout = window.setTimeout(() => {
      const queryEmail = new URLSearchParams(window.location.search).get("email");
      setEmail(queryEmail || window.sessionStorage.getItem("eva:verification-email") || "");
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  async function verifyEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) return setError("Enter the email address used to create your account.");
    if (!/^\d{6}$/.test(code)) return setError("Enter the 6-digit code from your email.");

    setError(null);
    setIsSubmitting(true);
    const { error: authError } = await insforge.auth.verifyEmail({ email: normalizedEmail, otp: code });
    if (authError) {
      setError(authError.message);
      setIsSubmitting(false);
      return;
    }
    await refresh();
    router.replace("/");
    router.refresh();
  }

  async function resendCode() {
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) return setError("Enter your account email first.");
    setError(null);
    setMessage(null);
    setIsResending(true);
    const { data, error: authError } = await insforge.auth.resendVerificationEmail({ email: normalizedEmail });
    setIsResending(false);
    if (authError) return setError(authError.message);
    setMessage(data?.message || "A fresh verification code is on its way.");
  }

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-3 duration-500">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><MailCheck className="size-6" /></div>
      <p className="mt-7 text-sm font-medium text-primary">One quick check</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-foreground sm:text-4xl">Verify your email.</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">Enter the 6-digit code we sent to your inbox to activate your studio.</p>
      <form className="mt-8 rounded-3xl border border-border/80 bg-card/90 p-5 shadow-xl shadow-foreground/[0.04] sm:p-7" onSubmit={verifyEmail} noValidate>
        <div className="space-y-4">
          <div className="space-y-2"><label className="text-sm font-medium" htmlFor="verify-email">Email address</label><Input autoComplete="email" className="h-11 rounded-xl" id="verify-email" onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" type="email" value={email} /></div>
          <div className="space-y-2"><label className="text-sm font-medium" htmlFor="verification-code">Verification code</label><Input aria-invalid={Boolean(error)} autoComplete="one-time-code" className="h-12 rounded-xl text-center text-lg font-semibold tracking-[0.48em]" id="verification-code" inputMode="numeric" maxLength={6} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} placeholder="000000" value={code} /></div>
          {error && <p className="rounded-xl bg-destructive/10 px-3 py-2.5 text-sm text-destructive">{error}</p>}
          {message && <p className="rounded-xl bg-primary/10 px-3 py-2.5 text-sm text-primary">{message}</p>}
          <Button className="h-11 w-full rounded-xl shadow-lg shadow-primary/20" disabled={isSubmitting} type="submit">{isSubmitting ? <LoaderCircle className="size-4 animate-spin" /> : <>Verify and continue <ArrowRight className="size-4" /></>}</Button>
        </div>
        <div className="mt-5 flex items-center justify-between gap-3 text-sm"><Link className="text-muted-foreground hover:text-foreground" href="/sign-in">Back to sign in</Link><button className="font-semibold text-primary disabled:opacity-50" disabled={isResending} onClick={resendCode} type="button">{isResending ? "Sending…" : "Resend code"}</button></div>
      </form>
    </div>
  );
}
