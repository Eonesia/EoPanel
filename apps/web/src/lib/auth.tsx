import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase, isSupabaseConfigured } from "./supabaseClient";
import { ALL_PROFILES, type Profile } from "../data/socios";

const DEMO_STORAGE_KEY = "eopanel-demo-profile";

type AuthStatus = "loading" | "authed" | "anon";

type AuthContextValue = {
  status: AuthStatus;
  profile: Profile | null;
  isDemo: boolean;
  loginDemo: (profileId: string) => void;
  loginWithPassword: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function profileFromEmail(email: string): Profile {
  const known = ALL_PROFILES.find((s) => s.email.toLowerCase() === email.toLowerCase());
  if (known) return known;
  const name = email.split("@")[0];
  const initials = name.slice(0, 2).toUpperCase();
  return { id: email, name, initials, email, role: "empleado" };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>(isSupabaseConfigured ? "loading" : "anon");
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      const stored = localStorage.getItem(DEMO_STORAGE_KEY);
      if (stored) {
        const found = ALL_PROFILES.find((s) => s.id === stored);
        if (found) {
          setProfile(found);
          setStatus("authed");
          return;
        }
      }
      setStatus("anon");
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      const email = data.session?.user.email;
      if (email) {
        setProfile(profileFromEmail(email));
        setStatus("authed");
      } else {
        setStatus("anon");
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const email = session?.user.email;
      if (email) {
        setProfile(profileFromEmail(email));
        setStatus("authed");
      } else {
        setProfile(null);
        setStatus("anon");
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      profile,
      isDemo: !isSupabaseConfigured,
      loginDemo: (profileId: string) => {
        const found = ALL_PROFILES.find((s) => s.id === profileId);
        if (!found) return;
        localStorage.setItem(DEMO_STORAGE_KEY, profileId);
        setProfile(found);
        setStatus("authed");
      },
      loginWithPassword: async (email: string, password: string) => {
        if (!supabase) return { error: "Supabase no está configurado en este entorno." };
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { error: error.message };
        return {};
      },
      logout: async () => {
        if (supabase) await supabase.auth.signOut();
        localStorage.removeItem(DEMO_STORAGE_KEY);
        setProfile(null);
        setStatus("anon");
      },
    }),
    [status, profile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-100 border-t-brand-500" />
      </div>
    );
  }

  if (status === "anon") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
