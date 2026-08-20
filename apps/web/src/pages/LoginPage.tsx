import { useState, type FormEvent } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { useToast } from "../lib/toast";
import { ALL_PROFILES } from "../data/socios";
import { Icon } from "../components/ui/Icon";

export function LoginPage() {
  const { status, isDemo, loginDemo, loginWithPassword, resetPassword } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const [view, setView] = useState<"login" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (status === "authed") {
    const from = (location.state as { from?: Location })?.from?.pathname ?? "/panel/global";
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await loginWithPassword(email, password);
    setLoading(false);
    if (res.error) setError(res.error);
  }

  async function handleReset(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await resetPassword(email);
    setLoading(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    showToast(`Enlace de recuperación enviado a ${email}`);
    setView("login");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-brand-400), transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-cyan-400), transparent 70%)" }}
      />

      <div className="fade-in-up relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="brand-gradient flex h-12 w-12 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-pop">
            E
          </span>
          <div>
            <h1 className="font-display text-xl font-bold text-ink">Panel Eonesia</h1>
            <p className="mt-1 text-sm text-ink-soft">Acceso interno de socios y equipo</p>
          </div>
        </div>

        <div className="surface-card p-6">
          {isDemo ? (
            <>
              <p className="mb-4 text-center text-xs font-medium text-ink-faint">
                Modo demo — sin Supabase conectado. Elige tu perfil para entrar.
              </p>
              <div className="flex flex-col gap-2">
                {ALL_PROFILES.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => loginDemo(s.id)}
                    className="fade-in-up flex items-center gap-3 rounded-xl border border-border px-3.5 py-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-100 hover:bg-brand-50 hover:shadow-[0_8px_20px_-10px_rgba(91,69,240,0.35)]"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-xs font-semibold text-white">
                      {s.initials}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">{s.name}</p>
                      <p className="truncate text-xs text-ink-faint">{s.title ?? s.email}</p>
                    </div>
                    <Icon name="ti-chevron-right" className="ml-auto text-ink-faint" />
                  </button>
                ))}
              </div>
            </>
          ) : view === "reset" ? (
            <form onSubmit={handleReset} className="flex flex-col gap-4">
              <div>
                <p className="text-sm font-semibold text-ink">Recuperar contraseña</p>
                <p className="mt-1 text-xs text-ink-faint">
                  Te enviaremos un enlace a tu correo para crear una contraseña nueva.
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="reset-email" className="text-xs font-semibold text-ink-soft">
                  Correo
                </label>
                <input
                  id="reset-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-lg border border-border-strong bg-surface px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  placeholder="tu@eonesia.com"
                />
              </div>
              {error && (
                <p role="alert" className="rounded-lg bg-danger-bg px-3 py-2 text-xs font-medium text-danger">
                  {error}
                </p>
              )}
              <button type="submit" disabled={loading} className="btn btn-primary w-full">
                {loading ? "Enviando…" : "Enviar enlace"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setView("login");
                  setError(null);
                }}
                className="text-center text-xs font-medium text-ink-faint transition-colors hover:text-ink"
              >
                Volver a iniciar sesión
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-semibold text-ink-soft">
                  Correo
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-lg border border-border-strong bg-surface px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  placeholder="tu@eonesia.com"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-xs font-semibold text-ink-soft">
                    Contraseña
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setView("reset");
                      setError(null);
                    }}
                    className="text-xs font-medium text-brand-600 transition-colors hover:text-brand-700"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-lg border border-border-strong bg-surface px-3 py-2.5 text-sm text-ink outline-none transition-colors focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                  placeholder="••••••••"
                />
              </div>
              {error && (
                <p role="alert" className="rounded-lg bg-danger-bg px-3 py-2 text-xs font-medium text-danger">
                  {error}
                </p>
              )}
              <button type="submit" disabled={loading} className="btn btn-primary mt-1 w-full">
                {loading ? "Entrando…" : "Entrar"}
              </button>
            </form>
          )}
        </div>

        <p className="mt-5 text-center text-xs text-ink-faint">
          Acceso restringido — información interna y confidencial de Eonesia.
        </p>
      </div>
    </div>
  );
}
