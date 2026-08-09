"use client";

import * as React from "react";

import { insforge } from "@/lib/insforge";

export type AuthUser = NonNullable<
  Awaited<ReturnType<typeof insforge.auth.getCurrentUser>>["data"]["user"]
>;

type AuthContextValue = {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<AuthUser | null>;
  signOut: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const refresh = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const { data, error: authError } = await insforge.auth.getCurrentUser();
    const nextUser = data.user ?? null;

    if (authError) {
      setError(authError.message);
    }

    setUser(nextUser);
    setIsLoading(false);
    return nextUser;
  }, []);

  const signOut = React.useCallback(async () => {
    const { error: authError } = await insforge.auth.signOut();

    if (authError) {
      throw new Error(authError.message);
    }

    setUser(null);
  }, []);

  React.useEffect(() => {
    const timeout = window.setTimeout(() => {
      void refresh();
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [refresh]);

  return (
    <AuthContext.Provider value={{ user, isLoading, error, refresh, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
