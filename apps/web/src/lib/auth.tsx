import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase, isSupabaseConfigured } from "./supabaseClient";
import { ALL_PROFILES, type Profile } from "../data/socios";

const DEMO_STORAGE_KEY = "eopanel-demo-profile";

/**
 * "mfa_challenge": hay una sesión de Supabase válida (contraseña correcta) pero
 * a nivel AAL1 — la cuenta tiene 2FA activado y falta el código TOTP para subir
 * a AAL2. No es "authed" todavía: RequireAuth debe seguir bloqueando el panel,
 * si no, tener 2FA activado no protegería nada más allá de la contraseña.
 */
type AuthStatus = "loading" | "authed" | "anon" | "mfa_challenge";

export type MfaFactor = { id: string; friendlyName?: string };

type AuthContextValue = {
  status: AuthStatus;
  profile: Profile | null;
  isDemo: boolean;
  loginDemo: (profileId: string) => void;
  loginWithPassword: (email: string, password: string) => Promise<{ error?: string }>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  /** Completa el reto TOTP tras un login con contraseña, cuando la cuenta tiene 2FA activado. */
  verifyMfaChallenge: (code: string) => Promise<{ error?: string }>;
  /** Alta de un nuevo factor TOTP — devuelve el QR (SVG) y el secreto para introducir a mano. */
  enrollMfa: () => Promise<{ factorId?: string; qrCode?: string; secret?: string; error?: string }>;
  /** Confirma la alta con el primer código generado por la app de autenticación. */
  confirmMfaEnrollment: (factorId: string, code: string) => Promise<{ error?: string }>;
  unenrollMfa: (factorId: string) => Promise<{ error?: string }>;
  listMfaFactors: () => Promise<{ factors: MfaFactor[]; error?: string }>;
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

    // Con 2FA activado en la cuenta, una sesión válida (contraseña correcta) se queda
    // en AAL1 hasta completar el reto TOTP — solo entonces se puede tratar como "authed".
    async function resolveStatus(email: string | undefined) {
      if (!email || !supabase) {
        setProfile(null);
        setStatus("anon");
        return;
      }
      setProfile(profileFromEmail(email));
      const { data } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (data && data.nextLevel === "aal2" && data.currentLevel !== data.nextLevel) {
        setStatus("mfa_challenge");
      } else {
        setStatus("authed");
      }
    }

    supabase.auth.getSession().then(({ data }) => resolveStatus(data.session?.user.email));

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      resolveStatus(session?.user.email);
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
      resetPassword: async (email: string) => {
        if (!supabase) return { error: "Supabase no está configurado en este entorno." };
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/login`,
        });
        if (error) return { error: error.message };
        return {};
      },
      logout: async () => {
        if (supabase) await supabase.auth.signOut();
        localStorage.removeItem(DEMO_STORAGE_KEY);
        setProfile(null);
        setStatus("anon");
      },
      verifyMfaChallenge: async (code: string) => {
        if (!supabase) return { error: "Supabase no está configurado en este entorno." };
        const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();
        if (factorsError) return { error: factorsError.message };
        const factor = factorsData?.totp[0];
        if (!factor) return { error: "No se encontró ningún factor de verificación activo." };

        const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({
          factorId: factor.id,
        });
        if (challengeError) return { error: challengeError.message };

        const { error: verifyError } = await supabase.auth.mfa.verify({
          factorId: factor.id,
          challengeId: challenge.id,
          code,
        });
        if (verifyError) return { error: verifyError.message };

        setStatus("authed");
        return {};
      },
      enrollMfa: async () => {
        if (!supabase) return { error: "Supabase no está configurado en este entorno." };
        const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp" });
        if (error) return { error: error.message };
        return { factorId: data.id, qrCode: data.totp.qr_code, secret: data.totp.secret };
      },
      confirmMfaEnrollment: async (factorId: string, code: string) => {
        if (!supabase) return { error: "Supabase no está configurado en este entorno." };
        const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
        if (challengeError) return { error: challengeError.message };
        const { error: verifyError } = await supabase.auth.mfa.verify({
          factorId,
          challengeId: challenge.id,
          code,
        });
        if (verifyError) return { error: verifyError.message };
        return {};
      },
      unenrollMfa: async (factorId: string) => {
        if (!supabase) return { error: "Supabase no está configurado en este entorno." };
        const { error } = await supabase.auth.mfa.unenroll({ factorId });
        if (error) return { error: error.message };
        return {};
      },
      listMfaFactors: async () => {
        if (!supabase) return { factors: [] };
        const { data, error } = await supabase.auth.mfa.listFactors();
        if (error) return { factors: [], error: error.message };
        return { factors: (data?.totp ?? []).map((f) => ({ id: f.id, friendlyName: f.friendly_name })) };
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

  if (status === "anon" || status === "mfa_challenge") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
