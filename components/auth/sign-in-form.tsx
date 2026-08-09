"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { ArrowRight, LoaderCircle, LockKeyhole, Mail } from "lucide-react";

import { GoogleIcon } from "@/components/auth/google-icon";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { insforge } from "@/lib/insforge";

type FieldErrors = { email?: string; password?: string; form?: string };

export function SignInForm() {
  const router = useRouter();
  const { isLoading: isSessionLoading, refresh, user } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);

  React.useEffect(() => {
    if (!isSessionLoading && user) router.replace("/");
  }, [isSessionLoading, router, user]);

  async function signInWithGoogle() {
    setErrors({});
    setIsGoogleLoading(true);

    const origin = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const { error } = await insforge.auth.signInWithOAuth("google", {
      redirectTo: new URL("/auth/callback", origin).toString(),
      additionalParams: { prompt: "select_account" },
    });

    if (error) {
      setErrors({ form: error.message });
      setIsGoogleLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: FieldErrors = {};
    const normalizedEmail = email.trim().toLowerCase();

    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!password) {
      nextErrors.password = "Enter your password.";
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    const { error } = await insforge.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error) {
      setErrors({ form: error.message });
      setIsSubmitting(false);
      return;
    }

    await refresh();
    router.replace("/");
    router.refresh();
  }

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-3 duration-500">
      <p className="text-sm font-medium text-primary">Welcome back</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-foreground sm:text-4xl">
        Sign in to your studio.
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Pick up exactly where your last great idea left off.
      </p>

      <div className="mt-8 rounded-3xl border border-border/80 bg-card/90 p-5 shadow-xl shadow-foreground/[0.04] backdrop-blur sm:p-7">
        <Button
          className="h-11 w-full rounded-xl bg-background text-foreground shadow-sm hover:bg-muted"
          disabled={isGoogleLoading || isSubmitting}
          onClick={signInWithGoogle}
          type="button"
          variant="outline"
        >
          {isGoogleLoading ? <LoaderCircle className="size-4 animate-spin" /> : <GoogleIcon />}
          Continue with Google
        </Button>

        <div className="my-6 flex items-center gap-3 text-[11px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
          <span className="h-px flex-1 bg-border" />
          or continue with email
          <span className="h-px flex-1 bg-border" />
        </div>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="sign-in-email">Email address</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                aria-invalid={Boolean(errors.email)}
                autoComplete="email"
                className="h-11 rounded-xl pl-9"
                id="sign-in-email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@company.com"
                type="email"
                value={email}
              />
            </div>
            {errors.email && <p className="text-xs font-medium text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-medium" htmlFor="sign-in-password">Password</label>
              <span className="text-xs text-muted-foreground">Password reset coming soon</span>
            </div>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                aria-invalid={Boolean(errors.password)}
                autoComplete="current-password"
                className="h-11 rounded-xl pl-9"
                id="sign-in-password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                type="password"
                value={password}
              />
            </div>
            {errors.password && <p className="text-xs font-medium text-destructive">{errors.password}</p>}
          </div>

          {errors.form && <p className="rounded-xl bg-destructive/10 px-3 py-2.5 text-sm text-destructive">{errors.form}</p>}

          <Button className="h-11 w-full rounded-xl shadow-lg shadow-primary/20" disabled={isSubmitting || isGoogleLoading} type="submit">
            {isSubmitting ? <LoaderCircle className="size-4 animate-spin" /> : <>Sign in <ArrowRight className="size-4" /></>}
          </Button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to EVA? <Link className="font-semibold text-primary hover:underline" href="/sign-up">Create an account</Link>
      </p>
    </div>
  );
}
