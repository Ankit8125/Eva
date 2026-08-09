"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";
import { ArrowRight, LoaderCircle, LockKeyhole, Mail, UserRound } from "lucide-react";

import { GoogleIcon } from "@/components/auth/google-icon";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { insforge } from "@/lib/insforge";

type FieldErrors = { name?: string; email?: string; password?: string; form?: string };

export function SignUpForm() {
  const router = useRouter();
  const { isLoading: isSessionLoading, user } = useAuth();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);

  React.useEffect(() => {
    if (!isSessionLoading && user) router.replace("/");
  }, [isSessionLoading, router, user]);

  async function signUpWithGoogle() {
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
    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (normalizedName.length < 2) nextErrors.name = "Use at least 2 characters.";
    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) nextErrors.email = "Enter a valid email address.";
    if (password.length < 6) nextErrors.password = "Use at least 6 characters.";
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    const { error } = await insforge.auth.signUp({
      name: normalizedName,
      email: normalizedEmail,
      password,
    });

    if (error) {
      setErrors({ form: error.message });
      setIsSubmitting(false);
      return;
    }

    window.sessionStorage.setItem("eva:verification-email", normalizedEmail);
    router.push(`/verify-email?email=${encodeURIComponent(normalizedEmail)}`);
  }

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-3 duration-500">
      <p className="text-sm font-medium text-primary">Start creating</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-foreground sm:text-4xl">
        Your studio starts here.
      </h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">Create a focused home for your team’s next chapter.</p>

      <div className="mt-8 rounded-3xl border border-border/80 bg-card/90 p-5 shadow-xl shadow-foreground/[0.04] backdrop-blur sm:p-7">
        <Button
          className="h-11 w-full rounded-xl bg-background text-foreground shadow-sm hover:bg-muted"
          disabled={isGoogleLoading || isSubmitting}
          onClick={signUpWithGoogle}
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
            <label className="text-sm font-medium" htmlFor="sign-up-name">Your name</label>
            <div className="relative"><UserRound className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" /><Input aria-invalid={Boolean(errors.name)} autoComplete="name" className="h-11 rounded-xl pl-9" id="sign-up-name" onChange={(event) => setName(event.target.value)} placeholder="Avery Morgan" value={name} /></div>
            {errors.name && <p className="text-xs font-medium text-destructive">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="sign-up-email">Email address</label>
            <div className="relative"><Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" /><Input aria-invalid={Boolean(errors.email)} autoComplete="email" className="h-11 rounded-xl pl-9" id="sign-up-email" onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" type="email" value={email} /></div>
            {errors.email && <p className="text-xs font-medium text-destructive">{errors.email}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="sign-up-password">Create a password</label>
            <div className="relative"><LockKeyhole className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" /><Input aria-invalid={Boolean(errors.password)} autoComplete="new-password" className="h-11 rounded-xl pl-9" id="sign-up-password" onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" type="password" value={password} /></div>
            {errors.password ? <p className="text-xs font-medium text-destructive">{errors.password}</p> : <p className="text-xs text-muted-foreground">Use 6 or more characters.</p>}
          </div>
          {errors.form && <p className="rounded-xl bg-destructive/10 px-3 py-2.5 text-sm text-destructive">{errors.form}</p>}
          <Button className="h-11 w-full rounded-xl shadow-lg shadow-primary/20" disabled={isSubmitting || isGoogleLoading} type="submit">
            {isSubmitting ? <LoaderCircle className="size-4 animate-spin" /> : <>Create account <ArrowRight className="size-4" /></>}
          </Button>
        </form>
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">Already have an account? <Link className="font-semibold text-primary hover:underline" href="/sign-in">Sign in</Link></p>
    </div>
  );
}
